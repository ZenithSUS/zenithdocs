import mongoose from "mongoose";
import Summary, {
  ISummary,
  ISummaryInput,
  SummaryTypeCount,
} from "../models/summary.model.js";

/**
 * Creates a new summary with the given data
 * @param data - Partial summary data
 * @returns The created summary
 * @throws MongooseError if summary data is invalid
 */
export const createSummary = async (data: Partial<ISummaryInput>) => {
  const summary = new Summary(data);
  return await summary.save();
};

/**
 * Gets All Summaries (Admin only)
 * @returns All Summaries
 */
export const getAllSummary = async () => {
  return await Summary.find({})
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Gets One Summary by it's index id
 * @param id - The summary index id
 * @returns Single Summary
 */
export const getSummaryById = async (id: string) => {
  return await Summary.findById(id)
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieves summaries belonging to a document
 * @param {string} documentId - Document ID
 * @returns An array of summaries belonging to the document
 * @throws {null} If the document ID is invalid
 */
export const getSummaryByDocument = async (documentId: string) => {
  return await Summary.find({ document: documentId })
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieves the total number of summaries belonging to a user
 * @param {string} userId - User ID
 * @returns The total number of summaries belonging to the user if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getTotalSummaryByUser = async (userId: string) => {
  return await Summary.countDocuments({ user: userId });
};

/**
 * Gets Summary by document in paginated data
 * @param documentId - Document ID
 * @param page - Page number to retrieve
 * @param limit - Number of documents to retrieve per page
 * @returns An object containing the summary and the count of summary belonging to the document
 * @throws {null} If the document ID is invalid
 */
export const getSummaryByDocumentPaginated = async (
  documentId: string,
  page: number,
  limit: number,
) => {
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    return null;
  }

  const offset = (page - 1) * limit;

  const summaries = await Summary.find({ document: documentId })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .lean();

  const total = await Summary.countDocuments({ document: documentId });

  return {
    summaries,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves summaries belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of summaries to retrieve per page
 * @returns An object containing the summaries and the count of summaries belonging to the user
 * @throws {null} If the user ID is invalid
 */
export const getSummaryByuserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const offset = (page - 1) * limit;

  const summaries = await Summary.find({ user: userId })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .lean();

  const total = await Summary.countDocuments({ user: userId });

  return {
    summaries,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves the total count of each type of summaries belonging to a user
 * @param {string} userId - User ID
 * @returns An array of objects containing the type of summary and the count of summaries of that type belonging to the user if found, empty array otherwise
 * @throws {null} If the user ID is invalid
 */
export const getAllTotalEachSummaryTypesByUser = async (
  userId: string,
): Promise<SummaryTypeCount[] | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return await Summary.aggregate<SummaryTypeCount>([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);
};

/**
 * Retrieves the 6 most recent summaries belonging to a user
 * @param {string} userId - User ID
 * @returns An array of the 6 most recent summaries belonging to the user if found, empty array otherwise
 * @throws {null} If the user ID is invalid
 */
export const getRecentSummaryByUser = async (userId: string) => {
  return await Summary.find({ user: userId })
    .populate({
      path: "document",
      select: "_id title fileType fileSize",
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
};

/**
 * Updates a summary
 * @param {string} id - Summary ID
 * @param {Partial<ISummary>} data - Data to update
 * @returns Updated summary if found, null otherwise
 */
export const updateSummary = async (id: string, data: Partial<ISummary>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const summary = await Summary.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  })
    .populate({
      path: "document",
      select: "_id title fileType filefileSize",
    })
    .lean();

  return summary;
};

/**
 * Deletes a summary by ID
 * @param {string} id - Summary ID
 * @returns Deleted summary if found, null otherwise
 * @throws {null} If the summary ID is invalid
 */
export const deleteSummary = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const summary = await Summary.findByIdAndDelete(id);
  return summary;
};
