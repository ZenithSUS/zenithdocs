import mongoose from "mongoose";
import Summary, { ISummary } from "../models/Summary.js";

/**
 * Creates a new summary with the given data
 * @param data - Partial summary data
 * @returns The created summary
 * @throws MongooseError if summary data is invalid
 */
export const createSummary = async (data: Partial<ISummary>) => {
  const summary = new Summary(data);
  return await summary.save();
};

/**
 * Gets All Summaries (Admin only)
 * @returns All Summaries
 */
export const getAllSummary = async () => {
  return await Summary.find({}).populate("document").lean();
};

/**
 * Gets One Summary by it's index id
 * @param id - The summary index id
 * @returns Single Summary
 */
export const getSummaryById = async (id: string) => {
  return await Summary.findById(id).populate("document").lean();
};

/**
 * Retrieves summaries belonging to a document
 * @param {string} documentId - Document ID
 * @returns An array of summaries belonging to the document
 * @throws {null} If the document ID is invalid
 */
export const getSummaryByDocument = async (documentId: string) => {
  return await Summary.find({ document: documentId })
    .populate("document")
    .lean();
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
    .populate("document")
    .lean();

  const total = await Summary.countDocuments({ document: documentId });

  return {
    summaries,
    total,
    totalPages: Math.ceil(total / limit),
  };
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
    new: true,
  })
    .populate("document")
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
