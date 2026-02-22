import mongoose from "mongoose";
import Folder, { IFolder } from "../models/Folder.js";

/**
 * Creates a new folder with the given data
 * @param {Partial<IFolder>} data - Data to create folder
 * @returns The created folder
 * @throws MongooseError if folder data is invalid
 */
export const createFolder = async (data: Partial<IFolder>) => {
  const folder = new Folder(data);
  return await folder.save();
};

/**
 * Retrieves all folders (admin only)
 * @returns An array of folders if found, null otherwise
 */
export const getAllFoldersAdmin = async () => {
  return await Folder.find().sort({ createdAt: -1 }).lean();
};

/**
 * Retrieves all folders belonging to a user
 * @param {string} userId - User ID
 * @returns An array of folders if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getFoldersByUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return await Folder.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

/**
 * Retrieves a single folder by its name
 * @param {string} name - Folder name
 * @returns The retrieved folder if found, null otherwise
 * @throws {null} If the folder name is invalid
 */
export const getFolderByName = async (name: string) => {
  return await Folder.findOne({ name }).lean();
};

/**
 * Retrieves a single folder by its ID
 * @param {string} id - Folder ID
 * @returns The retrieved folder if found, null otherwise
 * @throws {null} If the folder ID is invalid
 */
export const getFolderById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Folder.findById(id)
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieves all folders belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of folders to retrieve per page
 * @returns An object containing the folders, total count of folders and total number of pages
 * @throws {null} If the user ID is invalid
 */
export const getFoldersByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const offset = (page - 1) * limit;

  const folders = await Folder.find({ user: userId })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: "_id email",
    })
    .lean();

  const total = await Folder.countDocuments({ user: userId });

  return {
    folders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves the total number of folders belonging to a user
 * @param {string} userId - User ID
 * @returns The total number of folders belonging to the user if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getTotalFoldersByUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return await Folder.countDocuments({ user: userId });
};

/**
 * Updates a folder by its ID
 * @param {string} id - Folder ID
 * @param {Partial<IFolder>} data - Folder data to update
 * @returns The updated folder if found, null otherwise
 * @throws {null} If the folder ID is invalid
 */
export const updateFolder = async (id: string, data: Partial<IFolder>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Folder.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  }).lean();
};

/**
 * Deletes a folder by its ID
 * @param {string} id - Folder ID
 * @returns The deleted folder if found, null otherwise
 * @throws {null} If the folder ID is invalid
 */
export const deleteFolder = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Folder.findByIdAndDelete(id).lean();
};
