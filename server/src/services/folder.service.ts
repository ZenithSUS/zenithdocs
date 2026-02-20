import mongoose from "mongoose";
import { IFolder } from "../models/Folder.js";
import {
  createFolder,
  deleteFolder,
  getAllFoldersAdmin,
  getFolderById,
  getFolderByName,
  getFoldersByUser,
  getFoldersByUserPaginated,
  updateFolder,
} from "../repositories/folder.repository.js";
import AppError from "../utils/app-error.js";

/**
 * Service to create a new folder
 * @param {Partial<IFolder>} data - Data to create folder
 * @return The created folder
 * @throws AppError if folder data is invalid
 * @throws AppError if folder name or user ID is missing
 * @throws AppError if folder name is not a string
 */
export const createFolderService = async (
  data: Partial<IFolder>,
  currentUserId: string,
) => {
  if (!data || typeof data !== "object") {
    throw new AppError("Folder data is required", 400);
  }

  if (!data.name || typeof data.name !== "string") {
    throw new AppError("Folder name must be a string", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
    throw new AppError("Invalid user ID", 400);
  }

  return await createFolder({
    name: data.name.trim(),
    user: new mongoose.Types.ObjectId(currentUserId),
  });
};

/**
 * Retrieves all folders (admin only)
 * @returns An array of folders if found, null otherwise
 * @throws {AppError} If the user is not an admin
 */
export const getAllFoldersAdminService = async () => {
  return await getAllFoldersAdmin();
};

/**
 * Retrieves a single folder by its ID
 * @param {string} id - Folder ID
 * @returns The retrieved folder if found, null otherwise
 * @throws {AppError} If the folder ID is invalid or missing
 */
export const getFoldersByIdService = async (id: string) => {
  if (!id || typeof id !== "string") {
    throw new AppError("Folder ID is required and must be a string", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid folder ID", 400);
  }

  return await getFolderById(id);
};

/**
 * Retrieves all folders belonging to a user
 * @param {string} userId - User ID
 * @returns An array of folders if found, null otherwise
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If folders are not found
 */
export const getFoldersByUserService = async (userId: string) => {
  if (!userId || typeof userId !== "string") {
    throw new AppError("User ID is required and must be a string", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const folders = await getFoldersByUser(userId);
  return folders;
};

/**
 * Retrieves a single folder by its name
 * @param {string} name - Folder name
 * @returns The retrieved folder if found, null otherwise
 * @throws {AppError} If the folder name is invalid or missing
 */
export const getFolderByNameService = async (name: string) => {
  if (!name || typeof name !== "string") {
    throw new AppError("Folder name is required and must be a string", 400);
  }

  return await getFolderByName(name);
};

/**
 * Retrieves a single folder by its ID
 * @param {string} id - Folder ID
 * @returns The retrieved folder if found, null otherwise
 * @throws {AppError} If the folder ID is invalid or missing
 */
export const getFolderByIdService = async (id: string) => {
  if (!id || typeof id !== "string") {
    throw new AppError("Folder ID is required and must be a string", 400);
  }

  const folder = await getFolderById(id);

  return folder;
};

/**
 * Retrieves folders belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of folders to retrieve per page
 * @returns An object containing the folders and the count of folders belonging to the user
 * @throws {AppError} If the user ID is invalid or missing
 * @throws {AppError} If the page number is invalid or missing
 * @throws {AppError} If the limit is invalid or missing
 * @throws {AppError} If folders are not found
 */
export const getFolderByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!userId || typeof userId !== "string") {
    throw new AppError("User ID is required and must be a string", 400);
  }

  if (!page || typeof page !== "number" || page < 1) {
    throw new AppError(
      "Page number is required and must be a positive integer",
      400,
    );
  }

  if (!limit || typeof limit !== "number" || limit < 1) {
    throw new AppError("Limit is required and must be a positive integer", 400);
  }

  const folders = await getFoldersByUserPaginated(userId, page, limit);

  if (!folders) {
    throw new AppError("Folders not found", 404);
  }

  return folders;
};

/**
 * Updates a folder by its ID
 * @param {string} id - Folder ID
 * @param {Partial<IFolder>} data - Folder data to update
 * @param {string} currentUserId - Current user ID (used for authorization)
 * @param {"user" | "admin"} role - Role of the current user (used for authorization)
 * @returns The updated folder if found, null otherwise
 * @throws {AppError} If the folder ID is invalid or missing
 * @throws {AppError} If the folder data is invalid or missing
 * @throws {AppError} If the folder is not found
 * @throws {AppError} If the user is not authorized to update the folder
 */
export const updateFolderService = async (
  id: string,
  data: Partial<IFolder>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  if (!id || typeof id !== "string") {
    throw new AppError("Folder ID is required and must be a string", 400);
  }

  if (!data || Object.keys(data).length === 0 || typeof data !== "object") {
    throw new AppError("Folder data is required", 400);
  }

  const existingFolder = await getFolderById(id);

  if (!existingFolder) {
    throw new AppError("Folder not found", 404);
  }

  const ownerId = existingFolder.user._id.toString();

  if (ownerId !== currentUserId && role !== "admin") {
    throw new AppError("Unauthorized", 401);
  }

  // Prevent updating the user field
  delete data.user;

  const updatedFolder = await updateFolder(id, data);

  return updatedFolder;
};

/**
 *  Deletes a folder by its ID
 * @param {string} id - Folder ID
 * @param {string} currentUserId - ID of the current user (for authorization)
 * @param {"user" | "admin"} role - Role of the current user (for authorization)
 * @returns The deleted folder if found, null otherwise
 * @throws {AppError} If the folder ID is invalid or missing
 */
export const deleteFolderService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  if (!id || typeof id !== "string") {
    throw new AppError("Folder ID is required and must be a string", 400);
  }

  const existingFolder = await getFolderById(id);

  if (!existingFolder) {
    throw new AppError("Folder not found", 404);
  }

  if (!existingFolder.user) {
    throw new AppError("Folder has no owner", 500);
  }

  const ownerId = existingFolder.user._id.toString();

  if (ownerId !== currentUserId && role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const deletedFolder = await deleteFolder(id);

  return deletedFolder;
};
