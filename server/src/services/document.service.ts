import subtypePrefixMap from "../constants/subtype-prefix.js";
import { IDocumentInput } from "../models/document.model.js";
import {
  createDocument,
  deleteDocumentById,
  getAllDocuments,
  getDocumentById,
  getDocumentsByUserPaginated,
  getDocumentsByUserWithChatsPaginated,
  updateDocument,
} from "../repositories/document.repository.js";
import { getFolderById } from "../repositories/folder.repository.js";
import AppError from "../utils/app-error.js";
import PLAN_LIMITS from "../config/plans.js";
import {
  incrementUsage,
  getOrCreateUsageByUserAndMonth,
} from "../repositories/usage.repository.js";
import { deleteFileFromCloudinary } from "../lib/cloudinary.service.js";
import colors from "../utils/log-colors.js";
import {
  deleteDocumentChunksByDocumentId,
  getDocumentChunksByDocumentId,
} from "../repositories/document-chunk.repository.js";
import { embeddingQueue } from "../queues/embedding.queue.js";
import {
  createDocumentSchema,
  documentParamsSchema,
  getDocumentsByUserPageSchema,
  updateDocumentSchema,
} from "../schemas/document.schema.js";
import { userTokenSchema } from "../utils/zod.utils.js";
import {
  addStorageService,
  getOrCreateStorageService,
  removeStorageService,
} from "./storage.service.js";

/**
 * Checks if the user has exceeded the document limit and storage limit for the given month.
 * If the user has exceeded the document limit, it throws an AppError with a 400 status code.
 * If the user has exceeded the storage limit, it throws an AppError with a 400 status code.
 *
 * @param {string} userId - User ID
 * @param {number} fileSize - File size in bytes
 * @throws {AppError} If the user has exceeded the document limit or storage limit
 */
export const checkUserDocumentLimitsService = async (
  userId: string,
  fileSize: number,
) => {
  const month = new Date().toISOString().slice(0, 7);
  const usage = await getOrCreateUsageByUserAndMonth(userId, month);

  if (!usage.user || typeof usage.user === "string")
    throw new AppError("User not populated properly", 500);
  if (!("plan" in usage.user)) throw new AppError("User plan not found", 500);

  const userPlan = usage.user.plan as keyof typeof PLAN_LIMITS;
  const userLimit = PLAN_LIMITS[userPlan].documentLimit;
  const storageLimit = PLAN_LIMITS[userPlan].storageLimitMB;

  if (usage.documentsUploaded >= userLimit)
    throw new AppError("Document limit reached for this month", 400);

  const currentStorage = await getOrCreateStorageService(userId);
  const storageLimitBytes = storageLimit * 1024 * 1024;

  if (currentStorage.totalUsed + fileSize > storageLimitBytes)
    throw new AppError(
      `Storage limit exceeded for ${userPlan} plan (${storageLimit} MB)`,
      400,
    );
};

/**
 * Creates a new document with the given data
 * @param {Partial<IDocumentInput>} data - Document data to create
 * @throws {AppError} If the folder is not found or if the user is not allowed to share the document
 * @throws {AppError} If user document limit is reached for the current month
 * @throws {AppError} If the storage limit is exceeded for the current month
 * @returns {Promise<Document>} The created document
 */
export const createDocumentService = async (data: Partial<IDocumentInput>) => {
  const validData = createDocumentSchema.parse(data);

  if (validData.folder) {
    const existingFolder = await getFolderById(validData.folder);
    if (!existingFolder) throw new AppError("Folder not found", 404);
    if (existingFolder.user._id.toString() !== validData.user)
      throw new AppError("Forbidden", 403);
  }

  await addStorageService(validData.user, validData.fileSize);
  await incrementUsage(validData.user, 0, validData.fileSize);

  const document = await createDocument(validData);
  return document;
};

/**
 * Reprocesses an uploaded document with the given ID and user ID
 * @throws {AppError} If document ID is missing or invalid
 * @throws {AppError} If document is not found
 * @throws {AppError} If current user ID does not match the document's owner ID (403 Forbidden)
 * @returns The reprocessed document with the status set to "completed"
 */
export const reprocessDocumentService = async (
  id: string,
  currentUserId: string,
) => {
  const { docId } = documentParamsSchema.parse({ docId: id });
  const document = await getDocumentById(docId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.status === "completed" || document.status === "processing") {
    throw new AppError("Document already processed", 400);
  }

  if (document.user._id.toString() !== currentUserId) {
    throw new AppError("Forbidden", 403);
  }

  const documentChunks = await getDocumentChunksByDocumentId(docId);

  // Delete existing document chunks
  if (documentChunks.length > 0) {
    await deleteDocumentChunksByDocumentId(docId);
  }

  const storedSubtype = document.fileType;
  const prefix = subtypePrefixMap[storedSubtype];
  const fullMime = `${prefix}/${storedSubtype}`;

  if (!fullMime) throw new AppError("Invalid file type", 400);

  // Remove existing document chunks
  if (documentChunks.length > 0) {
    await deleteDocumentChunksByDocumentId(docId);
  }

  await embeddingQueue.add(
    "embedding",
    {
      documentId: docId,
      userId: currentUserId,
      publicId: document.publicId,
      mimeType: fullMime,
      fileUrl: document.fileUrl,
    },
    {
      attempts: 1,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );

  return { ...document, status: "processing" };
};

/**
 * Retrieves all documents from the database
 * @returns {Promise<IDocument[]>} Array of all documents
 * @throws {AppError} If documents data is invalid
 */
export const getAllDocumentsService = async () => {
  const documents = await getAllDocuments();
  return documents;
};

/**
 * Retrieves all documents belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of documents to retrieve per page
 * @returns An object containing the documents and the count of documents belonging to the user
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const getDocumentsByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getDocumentsByUserPageSchema.parse({ userId, page, limit });

  const documents = await getDocumentsByUserPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );
  return documents;
};

/**
 * Retrieves documents belonging to a user along with their associated chats in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of documents to retrieve per page
 * @returns An object containing the documents and the count of documents belonging to the user
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const getDocumentsByUserWithChatsPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getDocumentsByUserPageSchema.parse({ userId, page, limit });

  const documents = await getDocumentsByUserWithChatsPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );

  return documents;
};

/**
 * Retrieves a single document by its ID
 * @param {string} id - Document ID
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - User role (used for authorization)
 * @returns The retrieved document if found, null otherwise
 * @throws {AppError} If the document ID is invalid or missing
 * @throws {AppError} If the document is not found
 * @throws {AppError} If the current user ID does not match the document's owner ID (403 Forbidden)
 */
export const getDocumentByIdService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { docId } = documentParamsSchema.parse({ docId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const document = await getDocumentById(docId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  const ownerId = document.user._id.toString();

  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  return document;
};

/**
 * Updates a document by its ID
 * @param {string} id - Document ID
 * @param {Partial<IDocument>} data - Data to update
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - User role (used for authorization)
 * @returns Updated document if found, null otherwise
 * @throws {AppError} If the document ID is invalid or missing
 * @throws {AppError} If the document is not found
 * @throws {AppError} If the current user ID does not match the document's owner ID (403 Forbidden)
 */
export const updateDocumentService = async (
  id: string,
  data: Partial<IDocumentInput>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { docId } = documentParamsSchema.parse({ docId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingDocument = await getDocumentById(docId);

  if (!existingDocument) {
    throw new AppError("Document not found", 404);
  }

  const ownerId = existingDocument.user._id.toString();

  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Unauthorized", 403);
  }

  const documentData = updateDocumentSchema.parse(data);

  // Prevent changing the owner of the document
  delete data.user;

  const document = await updateDocument(docId, documentData);
  return document;
};

/**
 * Deletes a document by its ID
 * @param {string} id - Document ID
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - User role (used for authorization)
 * @returns Deleted document if found, null otherwise
 * @throws {AppError} If the document ID is invalid or missing
 * @throws {AppError} If the document is not found
 * @throws {AppError} If the current user ID does not match the document's owner ID (403 Forbidden)
 */
export const deleteDocumentByIdService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { docId } = documentParamsSchema.parse({ docId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingDocument = await getDocumentById(docId);
  if (!existingDocument) throw new AppError("Document not found", 404);

  const ownerId = existingDocument.user._id.toString();
  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Unauthorized", 403);
  }

  // Delete the file from Cloudinary if a publicId exists
  if (existingDocument.publicId) {
    try {
      await deleteFileFromCloudinary(existingDocument.publicId);
    } catch (err) {
      console.log("=".repeat(50));
      console.warn(
        `${colors.yellow}Failed to delete Cloudinary file: ${existingDocument.publicId}${colors.reset}`,
        err,
      );
      console.log("=".repeat(50) + "\n");
    }
  }

  // Delete the document from database
  const deletedDocument = await deleteDocumentById(docId);
  if (!deletedDocument) throw new AppError("Document not found", 404);

  // Delete the document chunks associated with the document
  await deleteDocumentChunksByDocumentId(docId);

  await removeStorageService(
    deletedDocument.user._id.toString(),
    deletedDocument.fileSize,
  );

  return deletedDocument;
};
