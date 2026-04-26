import mongoose from "mongoose";
import Folder, { IFolderInput } from "../models/folder.model.js";

/**
 * Creates a new folder with the given data
 * @param {Partial<IFolder>} data - Data to create folder
 * @returns The created folder
 * @throws MongooseError if folder data is invalid
 */
export const createFolder = async (data: IFolderInput) => {
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
  return await Folder.findById(id)
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ createdAt: -1 })
    .lean();
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
export const getFoldersWithDocumentsByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const [folders, total] = await Promise.all([
    Folder.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "_id",
          foreignField: "folder",
          as: "documents",
        },
      },
      {
        $addFields: {
          documentCount: { $size: "$documents" },
          counts: {
            $reduce: {
              input: "$documents",
              initialValue: {
                completed: 0,
                uploaded: 0,
                processing: 0,
                failed: 0,
              },
              in: {
                completed: {
                  $add: [
                    "$$value.completed",
                    { $cond: [{ $eq: ["$$this.status", "completed"] }, 1, 0] },
                  ],
                },
                uploaded: {
                  $add: [
                    "$$value.uploaded",
                    { $cond: [{ $eq: ["$$this.status", "uploaded"] }, 1, 0] },
                  ],
                },
                processing: {
                  $add: [
                    "$$value.processing",
                    { $cond: [{ $eq: ["$$this.status", "processing"] }, 1, 0] },
                  ],
                },
                failed: {
                  $add: [
                    "$$value.failed",
                    { $cond: [{ $eq: ["$$this.status", "failed"] }, 1, 0] },
                  ],
                },
              },
            },
          },
          user: { $arrayElemAt: ["$user", 0] },
          documents: {
            $map: {
              input: "$documents", // from the $lookup stage
              as: "doc", // each document in the documents array
              in: {
                _id: "$$doc._id",
                title: "$$doc.title",
                status: "$$doc.status",
                fileSize: "$$doc.fileSize",
                fileType: "$$doc.fileType",
                createdAt: "$$doc.createdAt",
                folder: "$$doc.folder",
              },
            },
          },
        },
      },
      {
        $addFields: {
          completedCount: "$counts.completed",
          uploadedCount: "$counts.uploaded",
          processingCount: "$counts.processing",
          failedCount: "$counts.failed",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdAt: 1,
          documentCount: 1,
          completedCount: 1,
          uploadedCount: 1,
          processingCount: 1,
          failedCount: 1,
          user: { _id: 1, email: 1 },
          documents: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
    ]),
    Folder.countDocuments({ user: userId }),
  ]);

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
  return await Folder.countDocuments({ user: userId });
};

/**
 * Updates a folder by its ID
 * @param {string} id - Folder ID
 * @param {Partial<IFolder>} data - Folder data to update
 * @returns The updated folder if found, null otherwise
 * @throws {null} If the folder ID is invalid
 */
export const updateFolder = async (id: string, data: Partial<IFolderInput>) => {
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
  return await Folder.findByIdAndDelete(id).lean();
};
