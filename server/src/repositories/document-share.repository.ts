import DocumentShare, { IDocumentShareInput } from "../models/DocumentShare.js";

/**
 * Creates a new document share
 *
 * @param {IDocumentShareInput} data - Document share data
 *
 * @returns {Promise<DocumentShare>} Created document share
 * @throws {AppError} If the document share data is invalid
 */
export const createDocumentShare = async (data: IDocumentShareInput) => {
  const documentShare = new DocumentShare(data);
  return await documentShare.save();
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
      select: "_id title fileType fileSize fileUrl",
    })
    .select({
      isActive: 0,
      "allowedUsers._id": 0,
    })
    .lean();
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
      select: "_id title fileType fileSize fileUrl",
    })
    .select({
      isActive: 0,
      "allowedUsers._id": 0,
    })
    .lean();
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
) => {
  return await DocumentShare.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  })
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .select({
      isActive: 0,
      "allowedUsers._id": 0,
    })
    .lean();
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
