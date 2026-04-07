import { nanoid } from "nanoid";
import AppError from "../utils/app-error.js";
import {
  createDocumentShare,
  deleteDocumentShareById,
  existsDocumentShareByToken,
  getDocumentShareByDocumentId,
  getDocumentShareById,
  getDocumentShareByToken,
  getDocumentSharesByUserIdPaginated,
  increaseDocumentShareAccess,
  updateDocumentShare,
} from "../repositories/document-share.repository.js";
import { getDocumentById } from "../repositories/document.repository.js";
import {
  createDocumentShareSchema,
  deleteDocumentShareSchema,
  getDocumentShareByIdSchema,
  getDocumentShareByTokenSchema,
  getDocumentSharesByUserPage,
  updateDocumentShareSchema,
} from "../schemas/document-share.schema.js";
import { IDocumentShareInput } from "../models/document-share.model.js";
import redis from "../config/redis.js";
import { Request } from "express";

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
  const validated = createDocumentShareSchema.parse({
    ...data,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  });

  const document = await getDocumentById(data.documentId);
  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.user._id.toString() !== validated.ownerId) {
    throw new AppError("You are not allowed to share this document", 403);
  }

  const existingShare = await getDocumentShareByDocumentId(
    validated.documentId,
  );

  if (existingShare) {
    throw new AppError("A share with this document already exists", 400);
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

    const seen = new Map<string, string>();

    for (const user of validated.allowedUsers) {
      if (seen.has(user.userId)) {
        throw new AppError(`Duplicate user: ${user.userId}`, 400);
      }
      seen.set(user.userId, user.permission);
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
    isActive: true,
    ...(validated.type === "public" && { shareToken }),
    allowDownload: validated.allowDownload ?? true,
  };

  const documentShare = await createDocumentShare(payload);

  return documentShare;
};

/**
 * Gets a document share by token (Public share)
 *
 * @param {string} token - Document share token
 * @param {Request} req - Express request
 *
 * @throws {AppError} If the document share is not found
 * @throws {AppError} If the token is invalid
 * @throws {AppError} If the user is not allowed to access the document
 *
 * @returns {Promise<DocumentShare>} Document share
 */
export const getDocumentShareByTokenService = async (
  token: string,
  req: Request,
) => {
  const validated = getDocumentShareByTokenSchema.parse({
    token,
  });

  const documentShare = await getDocumentShareByToken(validated.token);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (documentShare.expiresAt && documentShare.expiresAt < new Date()) {
    throw new AppError("Document share has expired", 404);
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const key = `doc:${documentShare._id.toString()}:viewer:${ip}`;

  const result = await redis.set(key, "1", "EX", 30, "NX");

  if (result) {
    void increaseDocumentShareAccess(documentShare._id.toString()).catch(
      () => {},
    );
  }

  return documentShare;
};

/**
 * Gets a document share by its ID (Private share)
 *
 * @param {string} id - Document share ID
 * @param {string} currentUserId - Current user ID
 * @param {Request} req - Express request
 * @throws {AppError} If the document share is not found
 *
 * @returns {Promise<DocumentShare>} Document share if found, null otherwise
 */
export const getDocumentShareByIdService = async (
  id: string,
  currentUserId: string,
  req: Request,
) => {
  const validated = getDocumentShareByIdSchema.parse({
    id,
    ownerId: currentUserId,
  });

  const documentShare = await getDocumentShareById(validated.id);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (!documentShare.isActive) {
    throw new AppError("Document share is not active", 404);
  }

  if (documentShare.expiresAt) {
    if (documentShare.expiresAt < new Date()) {
      throw new AppError("Document share has expired", 404);
    }
  }

  // Check if the user is allowed to access the document
  if (documentShare.type === "private" && documentShare.allowedUsers) {
    const allowedUser = documentShare.allowedUsers.find(
      (user) => user.userId.toString() === currentUserId,
    );

    const isOwner = documentShare.ownerId._id.toString() === validated.ownerId;

    if (!allowedUser && !isOwner) {
      throw new AppError("You are not allowed to access this document", 403);
    }
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const viewerId = currentUserId || ip;

  const key = `doc:${documentShare._id.toString()}:viewer:${viewerId}`;

  const result = await redis.set(key, "1", "EX", 30, "NX");

  if (result) {
    void increaseDocumentShareAccess(documentShare._id.toString()).catch(
      () => {},
    );
  }

  return documentShare;
};

/**
 * Retrieves all document shares belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of document shares to retrieve per page
 * @returns {Promise<{documentShares: DocumentShare[], pagination: {page: number, limit: number, total: number, totalPages: number}>} An object containing the document shares and the pagination information
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const getDocumentSharesByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getDocumentSharesByUserPage.parse({
    userId,
    page,
    limit,
  });

  const documentShares = await getDocumentSharesByUserIdPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );

  return documentShares;
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
  const shouldClearExpiry = data.expiresAt === null;
  const documentShare = await getDocumentShareById(id);

  if (!documentShare) {
    throw new AppError("Document share not found", 404);
  }

  if (documentShare.ownerId._id.toString() !== currentUserId) {
    throw new AppError(
      "You are not allowed to update this document share",
      403,
    );
  }

  if (data.type === "public") {
    data.allowedUsers = [];
  }

  if (data.type === "private") {
    data.publicPermission = undefined;

    const hasOwner = data.allowedUsers?.some(
      (user) => user.userId === documentShare.ownerId._id.toString(),
    );

    if (hasOwner) {
      throw new AppError("You cannot add yourself as an allowed user", 400);
    }
  }

  const validated = updateDocumentShareSchema.parse({
    id,
    ownerId: currentUserId,
    ...data,
    expiresAt: data.expiresAt ?? undefined,
  });

  return await updateDocumentShare(id, validated, shouldClearExpiry);
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

  const data = deleteDocumentShareSchema.parse({ id, ownerId: currentUserId });

  if (documentShare.ownerId._id.toString() !== data.ownerId) {
    throw new AppError(
      "You are not allowed to delete this document share",
      403,
    );
  }

  const deletedShare = await deleteDocumentShareById(data.id);
  return deletedShare;
};
