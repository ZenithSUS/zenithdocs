import redis from "../config/redis.js";
import CacheKeys from "../config/cache-keys.js";
import { IFolderInput } from "../models/folder.model.js";
import {
  createFolder,
  deleteFolder,
  getAllFoldersAdmin,
  getFolderById,
  getFolderByName,
  getFoldersByUser,
  getFoldersWithDocumentsByUserPaginated,
  updateFolder,
} from "../repositories/folder.repository.js";
import AppError from "../utils/app-error.js";
import {
  createFolderSchema,
  folderParamsSchema,
  getFolderByNameSchema,
  getFolderByUserPageSchema,
  getFolderByUserSchema,
  updateFolderSchema,
} from "../schemas/folder.schema.js";
import { userTokenSchema } from "../utils/zod.utils.js";

/**
 * Creates a new folder with the given data
 * @param {IFolderInput} data - Data to create folder
 * @param {string} currentUserId - Current user ID
 * @returns The created folder
 * @throws {ZodError} If data is invalid or missing
 * @throws {ZodError} If user ID is invalid or missing
 */
export const createFolderService = async (
  data: IFolderInput,
  currentUserId: string,
) => {
  const validated = createFolderSchema.parse({
    name: data.name,
    user: currentUserId,
  });

  const existingFolder = await getFolderByName(validated.name);

  if (existingFolder) {
    throw new AppError("Folder already exists", 400);
  }

  await redis.del(CacheKeys.dashboardStable(validated.user)).catch(() => {});
  return await createFolder(validated);
};

/**
 * Retrieves all folders (admin only)
 * @returns An array of folders if found, null otherwise
 */
export const getAllFoldersAdminService = async () => {
  return await getAllFoldersAdmin();
};

/**
 * Retrieves a folder by its ID
 * @param {string} id - Folder ID
 * @returns The folder if found, null otherwise
 * @throws {AppError} If folder ID is invalid or missing
 */
export const getFoldersByIdService = async (id: string) => {
  const { folderId } = folderParamsSchema.parse({ folderId: id });
  return await getFolderById(folderId);
};

/**
 * Retrieves all folders belonging to a user
 * @param {string} userId - User ID
 * @returns An array of folders if found, null otherwise
 * @throws {AppError} If user ID is invalid or missing
 */
export const getFoldersByUserService = async (userId: string) => {
  const { userId: folderUserId } = getFolderByUserSchema.parse({ userId });

  const folders = await getFoldersByUser(folderUserId);
  return folders;
};

/**
 * Retrieves a single folder by its name
 * @param {string} name - Folder name
 * @returns The retrieved folder if found, null otherwise
 * @throws {AppError} If folder name is invalid or missing
 */
export const getFolderByNameService = async (name: string) => {
  const { name: folderName } = getFolderByNameSchema.parse({ name });
  return await getFolderByName(folderName);
};

/**
 * Retrieves a single folder by its ID
 * @param {string} id - Folder ID
 * @returns The retrieved folder if found, null otherwise
 * @throws {AppError} If folder ID is invalid or missing
 */
export const getFolderByIdService = async (id: string) => {
  const { folderId } = folderParamsSchema.parse({ folderId: id });

  const folder = await getFolderById(folderId);
  return folder;
};

/**
 * Retrieves folders belonging to a user with their documents, paginated
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of folders to retrieve per page
 * @returns An array of folders with their documents if found, null otherwise and pagination info
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If page or limit is invalid or missing
 * @throws {AppError} If page or limit is not a positive integer
 */
export const getFoldersWithDocumentsByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getFolderByUserPageSchema.parse({ userId, page, limit });

  const folders = await getFoldersWithDocumentsByUserPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );

  if (!folders) {
    throw new AppError("Folders not found", 404);
  }

  return folders;
};

/**
 * Updates a folder by its ID
 * @param {string} id - Folder ID
 * @param {Partial<IFolderInput>} data - Folder data to update
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - User role (used for authorization)
 * @returns Updated folder if found, null otherwise
 * @throws {AppError} If folder ID is invalid or missing
 * @throws {AppError} If folder is not found
 * @throws {AppError} If current user ID does not match the folder's owner ID (401 Unauthorized)
 */
export const updateFolderService = async (
  id: string,
  data: Partial<IFolderInput>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { folderId } = folderParamsSchema.parse({ folderId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });
  const validated = updateFolderSchema.parse({ name: data.name });

  const existingFolder = await getFolderById(folderId);

  if (!existingFolder) {
    throw new AppError("Folder not found", 404);
  }

  if (existingFolder.name === validated.name) {
    return existingFolder;
  }

  const ownerId = existingFolder.user._id.toString();

  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Unauthorized", 401);
  }

  const updatedFolder = await updateFolder(folderId, validated);
  return updatedFolder;
};

/**
 * Deletes a folder by its ID
 * @param {string} id - Folder ID
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - User role (used for authorization)
 * @returns Deleted folder if found, null otherwise
 * @throws {AppError} If folder ID is invalid or missing
 * @throws {AppError} If folder is not found
 * @throws {AppError} If current user ID does not match the folder's owner ID (401 Unauthorized) or if the current user is not an admin (403 Forbidden)
 */
export const deleteFolderService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { folderId } = folderParamsSchema.parse({ folderId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingFolder = await getFolderById(folderId);

  if (!existingFolder) {
    throw new AppError("Folder not found", 404);
  }

  if (!existingFolder.user) {
    throw new AppError("Folder has no owner", 500);
  }

  const ownerId = existingFolder.user._id.toString();

  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const deletedFolder = await deleteFolder(folderId);

  await redis.del(CacheKeys.dashboardStable(currentUserId)).catch(() => {});
  return deletedFolder;
};
