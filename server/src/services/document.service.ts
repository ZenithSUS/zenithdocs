import { IDocument } from "../models/Document.js";
import {
  createDocument,
  deleteDocumentById,
  getAllDocuments,
  getDocumentById,
  getDocumentsByUserPaginated,
  updateDocument,
} from "../repositories/document.repository.js";
import { getFolderById } from "../repositories/folder.repository.js";
import AppError from "../utils/app-error.js";
import mongoose from "mongoose";
import PLAN_LIMITS from "../config/plans.js";
import {
  incrementUsage,
  updateUsageMonthByUser,
} from "../repositories/usage.repository.js";
import { deleteFileFromCloudinary } from "../lib/cloudinary.service.js";
import colors from "../utils/log-colors.js";

/**
 * Creates a new document with the given data
 * @param {Partial<IDocument>} data - Data to create document
 * @returns The created document
 * @throws {AppError} If data is invalid or missing
 * @throws {AppError} If title, file URL, file type, or file size is missing or invalid
 * @throws {AppError} If user ID is invalid or missing
 * @throws {AppError} If folder ID is invalid or missing, or if the folder does not exist or belongs to a different user
 */
export const createDocumentService = async (data: Partial<IDocument>) => {
  const month = new Date().toISOString().slice(0, 7);

  if (!data || typeof data !== "object") {
    throw new AppError("Data is required", 400);
  }

  // Destructure fields from data
  const { title, fileUrl, fileType, fileSize, user, folder } = data;

  // Validate required fields
  if (!title || typeof title !== "string")
    throw new AppError("Title is required", 400);

  if (!fileUrl || typeof fileUrl !== "string")
    throw new AppError("File URL is required", 400);

  if (!fileType || typeof fileType !== "string")
    throw new AppError("File type is required", 400);

  if (typeof fileSize !== "number")
    throw new AppError("File size must be a number", 400);

  if (!user || !mongoose.Types.ObjectId.isValid(user))
    throw new AppError("Invalid User ID", 400);

  // If folder is provided, validate it and check ownership
  if (folder) {
    if (!mongoose.Types.ObjectId.isValid(folder.toString()))
      throw new AppError("Invalid Folder ID", 400);

    const existingFolder = await getFolderById(folder.toString());

    if (!existingFolder) throw new AppError("Folder not found", 404);

    if (existingFolder.user._id.toString() !== user.toString())
      throw new AppError("Forbidden", 403);
  }

  // Update usage or create a new one
  let usageLimit = await updateUsageMonthByUser(user.toString(), month);

  if (!usageLimit.user || typeof usageLimit.user === "string") {
    throw new AppError("User not populated properly", 500);
  }

  if (!("plan" in usageLimit.user)) {
    throw new AppError("User plan not found", 500);
  }

  const userLimit =
    PLAN_LIMITS[usageLimit.user.plan as keyof typeof PLAN_LIMITS].documentLimit;

  if (usageLimit.documentsUploaded >= userLimit) {
    throw new AppError("Document limit reached for this month", 400);
  }

  const document = await createDocument(data);

  await incrementUsage(user.toString(), 0);
  return document;
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
  if (!userId) throw new AppError("User ID is required", 400);

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new AppError("Invalid User ID", 400);

  if (!page || !limit) throw new AppError("Page and limit are required", 400);

  if (page < 1 || limit < 1)
    throw new AppError("Page and limit must be positive integers", 400);

  const documents = await getDocumentsByUserPaginated(userId, page, limit);
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
  if (!id) {
    throw new AppError("Document ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const document = await getDocumentById(id);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  const ownerId = document.user._id.toString();

  if (ownerId !== currentUserId && role !== "admin") {
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
  data: Partial<IDocument>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  if (!id) {
    throw new AppError("Document ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const existingDocument = await getDocumentById(id);

  if (!existingDocument) {
    throw new AppError("Document not found", 404);
  }

  const ownerId = existingDocument.user._id.toString();

  if (ownerId !== currentUserId && role !== "admin") {
    throw new AppError("Unauthorized", 403);
  }

  if (!data || typeof data !== "object") {
    throw new AppError("Data is required", 400);
  }

  // Prevent changing the owner of the document
  delete data.user;

  const document = await updateDocument(id, data);
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
  if (!id) throw new AppError("Document ID is required", 400);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Document ID", 400);
  }

  const existingDocument = await getDocumentById(id);
  if (!existingDocument) throw new AppError("Document not found", 404);

  const ownerId = existingDocument.user._id.toString();
  if (ownerId !== currentUserId && role !== "admin") {
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
      console.log("=".repeat(50));
      // We ignore the error so the document can still be deleted in DB
    }
  }

  // Delete the document from database
  const deletedDocument = await deleteDocumentById(id);
  if (!deletedDocument) throw new AppError("Document not found", 404);

  return deletedDocument;
};
