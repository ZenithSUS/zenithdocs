import { nanoid } from "nanoid";
import AppError from "../utils/app-error.js";
import {
  createDocumentShare,
  existsDocumentShareByToken,
  getDocumentShareById,
  getDocumentShareByToken,
  updateDocumentShare,
} from "../repositories/document-share.repository.js";
import { getDocumentById } from "../repositories/document.repository.js";
import {
  createDocumentShareSchema,
  deleteDocumentShareSchema,
  getDocumentShareByIdSchema,
  getDocumentShareByTokenSchema,
  updateDocumentShareSchema,
} from "../schemas/document-share.schema.js";
import { IDocumentShareInput } from "../models/DocumentShare.js";

/**
 * Creates a new document share
 *
 * @param {IDocumentShareInput} data - Document share data
 *
 * @throws {AppError} If the document is not found
 * @throws {AppError} If the user is not allowed to share the document
 * @throws {AppError} If the private share does not have allowed users
 * @throws {AppError} If the owner is included in the allowed users
 *
 * @returns {Promise<DocumentShare>} Document share
 */
export const createDocumentShareService = async (data: IDocumentShareInput) => {
  const validated = createDocumentShareSchema.parse(data);

  const document = await getDocumentById(data.documentId);
  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.user.toString() !== validated.ownerId) {
    throw new AppError("You are not allowed to share this document", 403);
  }

  if (validated.type === "private") {
    if (!validated.allowedUsers || validated.allowedUsers.length === 0) {
      throw new AppError("Private shares must have allowed users", 400);
    }
  }

  if (validated.allowedUsers) {
    const hasOwner = validated.allowedUsers.some(
      (user) => user.userId === validated.ownerId,
    );

    if (hasOwner) {
      throw new AppError("Owner cannot be included in allowed users", 400);
    }
  }

  let shareToken: string;
  let exists: boolean;

  do {
    shareToken = nanoid(32);
    exists = await existsDocumentShareByToken(shareToken);
  } while (exists);

  const payload = {
    ...validated,
    shareToken,
    isActive: true,
    allowDownload: validated.allowDownload ?? true,
    allowEdit: validated.allowEdit ?? false,
  };

  const documentShare = await createDocumentShare(payload);

  return documentShare;
};

/**
 * Gets a document share by token (Private share)
 *
 * @param {string} token - Document share token
 * @param {string} currentUserId - Current user ID
 *
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the token is invalid
 * @throws {AppError} If the user is not allowed to access the document
 *
 * @returns {Promise<DocumentShare>} Document share
 */
export const getDocumentShareByTokenService = async (
  token: string,
  currentUserId: string,
) => {
  const validated = getDocumentShareByTokenSchema.parse({ token });

  const documentShare = await getDocumentShareByToken(validated.token);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (documentShare.shareToken !== validated.token) {
    throw new AppError("Invalid token", 400);
  }

  // Check if the user is allowed to access the document
  if (documentShare.type === "private" && documentShare.allowedUsers) {
    const allowedUser = documentShare.allowedUsers.find(
      (user) => user.userId.toString() === currentUserId,
    );

    const isOwner = documentShare.ownerId.toString() === currentUserId;

    if (!allowedUser && !isOwner) {
      throw new AppError("You are not allowed to access this document", 403);
    }
  }

  return documentShare;
};

/**
 * Gets a document share by its ID (Public share)
 *
 * @param {string} id - Document share ID
 *
 * @throws {AppError} If the document share is not found
 *
 * @returns {Promise<DocumentShare>} Document share if found, null otherwise
 */
export const getDocumentShareByIdService = async (id: string) => {
  const validated = getDocumentShareByIdSchema.parse({ id });

  const documentShare = await getDocumentShareById(validated.id);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (!documentShare.isActive) {
    throw new AppError("Document share is not active", 404);
  }

  if (documentShare.type === "private" && documentShare.allowedUsers) {
    throw new AppError("You are not allowed to access this document", 403);
  }

  return documentShare;
};

/**
 * Updates a document share by its ID
 * @param {string} id - Document share ID
 * @param {string} currentUserId - Current user ID
 * @param {Partial<IDocumentShareInput>} data - Data to update
 * @returns {Promise<DocumentShare>} Updated document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the current user ID does not match the document share's owner ID (403 Forbidden)
 */
export const updateDocumentShareService = async (
  id: string,
  currentUserId: string,
  data: Partial<IDocumentShareInput>,
) => {
  const documentShare = await getDocumentShareById(id);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (documentShare.ownerId.toString() !== currentUserId) {
    throw new AppError(
      "You are not allowed to update this document share",
      403,
    );
  }

  const validated = updateDocumentShareSchema.parse({
    id,
    ownerId: currentUserId,
    ...data,
  });

  return await updateDocumentShare(id, validated);
};

/**
 * Deletes a document share by its ID
 * @param {string} id - Document share ID
 * @param {string} currentUserId - Current user ID
 * @returns {Promise<DocumentShare>} Deleted document share if found, null otherwise
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the current user ID does not match the document share's owner ID (403 Forbidden)
 */
export const deleteDocumentShareService = async (
  id: string,
  currentUserId: string,
) => {
  const documentShare = await getDocumentShareById(id);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  const data = deleteDocumentShareSchema.parse({ id, currentUserId });

  if (documentShare.ownerId.toString() !== data.ownerId) {
    throw new AppError(
      "You are not allowed to delete this document share",
      403,
    );
  }

  return await getDocumentShareById(id);
};
