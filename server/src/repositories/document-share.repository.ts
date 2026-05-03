import { Types } from "mongoose";
import DocumentShare, {
  IDocumentShare,
  IDocumentShareInput,
} from "../models/document-share.model.js";

/**
 * Creates a new document share
 *
 * @param {IDocumentShareInput} data - Document share data
 *
 * @returns {Promise<DocumentShare>} Created document share
 * @throws {AppError} If the document share data is invalid
 */
export const createDocumentShare = async (data: IDocumentShareInput) => {
  const documentShare = await DocumentShare.create(data);
  const newDocumentShare = await DocumentShare.findById(documentShare._id)
    .populate({ path: "allowedUsers.userId", select: "_id email" })
    .populate({ path: "ownerId", select: "_id email" })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .lean();

  return newDocumentShare;
};

/**
 * Gets a document share by its token
 *
 * @param {string} token - Document share token
 *
 * @returns {Promise<DocumentShare>} Document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the token is invalid
 * @throws {AppError} If the user is not allowed to access the document
 */
export const getDocumentShareByToken = async (token: string) => {
  return await DocumentShare.findOne({ shareToken: token, isActive: true })
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl rawText",
    })
    .select({
      "allowedUsers._id": 0,
    })
    .lean();
};

/**
 * Gets a document share by its associated document ID
 *
 * @param {string} documentId - Document ID
 *
 * @returns {Promise<DocumentShare | null>} Document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 */
export const getDocumentShareByDocumentId = async (documentId: string) => {
  return await DocumentShare.findOne({ documentId });
};

/**
 * Retrieves document shares belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of document shares to retrieve per page
 * @returns {Promise<{ documentShares: DocumentShare[], pagination: { page: number, limit: number, total: number, totalPages: number } >} An object containing the document shares and the pagination information
 * @throws {null} If the user ID is invalid
 */
export const getDocumentSharesByUserIdPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offest = (page - 1) * limit;

  const [documentShares, total, totalAllowedUsers] = await Promise.all([
    DocumentShare.find({
      $or: [
        { ownerId: new Types.ObjectId(userId) },
        { "allowedUsers.userId": new Types.ObjectId(userId) },
      ],
    })
      .skip(offest)
      .limit(limit)
      .populate({
        path: "ownerId",
        select: "_id email",
      })
      .populate({
        path: "documentId",
        select: "_id title fileType fileSize fileUrl",
      })
      .populate({
        path: "allowedUsers.userId",
        select: "_id email",
      })
      .select({
        "allowedUsers._id": 0,
      })
      .sort({ createdAt: -1 })
      .lean(),
    DocumentShare.countDocuments({ ownerId: userId }),
    DocumentShare.countDocuments({
      "allowedUsers.userId": userId,
    }),
  ]);

  const totalShares = total + totalAllowedUsers;
  const totalPages = Math.ceil(totalShares / limit);

  return {
    documentShares,
    pagination: { page, limit, total, totalPages: totalPages },
  };
};

/**
 * Checks if a document share with the given token exists
 *
 * @param {string} token - Document share token
 *
 * @returns {Promise<boolean>} True if the document share exists, false otherwise
 */
export const existsDocumentShareByToken = async (
  token: string,
): Promise<boolean> => {
  const share = await DocumentShare.exists({ shareToken: token });
  return !!share;
};

/**
 * Gets a document share by its ID
 *
 * @param {string} id - Document share ID
 *
 * @returns {Promise<DocumentShare>} Document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 */
export const getDocumentShareById = async (id: string) => {
  return await DocumentShare.findById(id)
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl rawText",
    })
    .select({
      "allowedUsers._id": 0,
    })
    .lean();
};

/**
 * Retrieves document shares belonging to a user or an allowed user and a document
 *
 * @param {string} userId - User ID
 * @param {string} documentId - Document ID
 *
 * @returns {Promise<DocumentShare[]>} Document shares if found, empty array otherwise
 */
export const getDocumentShareByUserAndDocumentId = async (
  userId: string,
  documentId: string,
) => {
  return await DocumentShare.find({
    documentId,
    $or: [
      { ownerId: new Types.ObjectId(userId) },
      { "allowedUsers.userId": new Types.ObjectId(userId) },
    ],
  });
};

/**
 * Retrieves the total number of documents belonging to a user that have been shared with them
 * @param {string} userId - User ID
 * @returns {Promise<number>} The total number of shared documents if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getTotalSharedDocumentsByUser = async (userId: string) => {
  return await DocumentShare.countDocuments({
    ownerId: new Types.ObjectId(userId),
  });
};

/**
 * Increases the access count of a document share by one and updates the last accessed at field to the current date.
 * @param {string} id - Document share ID
 * @returns {Promise<DocumentShare>} Updated document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 */
export const increaseDocumentShareAccess = async (id: string) => {
  return await DocumentShare.findByIdAndUpdate(id, {
    $inc: { accessCount: 1 },
    $set: { lastAccessedAt: new Date() },
  });
};

/**
 * Updates a document share by its ID
 *
 * @param {string} id - Document share ID
 * @param {Partial<IDocumentShareInput>} data - Data to update
 *
 * @returns {Promise<DocumentShare>} Updated document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the current user ID does not match the document share's owner ID (403 Forbidden)
 */
export const updateDocumentShare = async (
  id: string,
  data: Partial<IDocumentShareInput>,
  clearExpiry = false, // ← new param
) => {
  const { expiresAt, ...rest } = data;

  const updateQuery: Record<string, unknown> = {
    $set: rest,
  };

  if (clearExpiry) {
    updateQuery.$unset = { expiresAt: "" };
  } else if (expiresAt !== undefined) {
    (updateQuery.$set as Record<string, unknown>).expiresAt = expiresAt;
  }

  return await DocumentShare.findByIdAndUpdate(id, updateQuery, {
    returnDocument: "after",
  })
    .populate({ path: "ownerId", select: "_id email" })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .populate({ path: "allowedUsers.userId", select: "_id email" })
    .select({ "allowedUsers._id": 0 })
    .lean<IDocumentShare>();
};

/**
 * Deletes a document share by its ID
 *
 * @param {string} id - Document share ID
 *
 * @returns {Promise<DocumentShare | null>} Deleted document share if found, null otherwise
 */
export const deleteDocumentShareById = async (id: string) => {
  return await DocumentShare.findByIdAndDelete(id);
};
