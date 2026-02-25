import { summarizeText } from "../lib/ai/mistral.service.js";
import { ISummary } from "../models/Summary.js";
import {
  createSummary,
  deleteSummary,
  getAllSummary,
  getSummaryByDocument,
  getSummaryByDocumentPaginated,
  getSummaryById,
  getSummaryByuserPaginated,
  updateSummary,
} from "../repositories/summary.repository.js";
import AppError from "../utils/app-error.js";
import mongoose from "mongoose";

/**
 * Creates a new summary with the given data.
 * @param {Partial<ISummary>} data - Data to create summary
 * @returns {Promise<ISummary>} Created summary if found, null otherwise
 * @throws {AppError} If data is invalid or missing
 * @throws {AppError} If document ID is invalid or missing
 * @throws {AppError} If summary type is invalid or missing
 * @throws {AppError} If content is invalid or missing
 */
export const createSummaryService = async (data: Partial<ISummary>) => {
  const validTypes = ["short", "bullet", "detailed", "executive"] as const;

  if (!data || typeof data !== "object") {
    throw new AppError("Data is required", 400);
  }

  if (!data.document || typeof data.document !== "string") {
    throw new AppError("Document ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(data.document)) {
    throw new AppError("Invalid Document ID", 400);
  }

  if (!data.type || typeof data.type !== "string") {
    throw new AppError("Summary Type is required", 400);
  }

  if (!validTypes.includes(data.type as any)) {
    throw new AppError("Invalid Summary Type", 400);
  }

  if (!data.content || typeof data.content !== "string") {
    throw new AppError("Content is required", 400);
  }

  const { content, tokensUsed } = await summarizeText(
    data.content,
    data.type as any,
  );

  const summary = await createSummary({
    user: data.user,
    document: data.document,
    type: data.type,
    content: content.toString(), //  Add generated content
    tokensUsed, // Store token usage
  });

  return summary;
};

/**
 * Retrieves all summaries
 * @returns All summaries
 */
export const getAllSummaryService = async () => {
  const summary = await getAllSummary();
  return summary;
};

/**
 * Retrieves a single summary by its ID
 * @param {string} id - Summary ID
 * @returns Single summary if found, null otherwise
 * @throws {Error} If the summary ID is invalid
 */
export const getSummaryByIdService = async (id: string) => {
  if (!id) {
    throw new Error("Summary ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Summary ID is invalid");
  }

  const summary = await getSummaryById(id);
  return summary;
};

/**
 * Retrieves summaries belonging to a document
 * @param {string} documentId - Document ID
 * @returns An array of summaries belonging to the document
 * @throws {Error} If the document ID is invalid
 */
export const getSummaryByDocumentService = async (documentId: string) => {
  if (!documentId) {
    throw new Error("Document ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new Error("Document ID is invalid");
  }

  const summary = await getSummaryByDocument(documentId);
  return summary;
};

/**
 * Retrieves summaries belonging to a document in a paginated manner
 * @param {string} documentId - Document ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of summaries to retrieve per page
 * @returns An object containing the summaries and the count of summaries belonging to the document
 * @throws {AppError} If document ID is invalid or missing
 * @throws {AppError} If page or limit is invalid or missing
 * @throws {AppError} If page or limit is not a positive integer
 */
export const getSummarByDocumentyPaginatedService = async (
  documentId: string,
  page: number,
  limit: number,
) => {
  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid Document ID", 400);
  }

  if (!page || !limit) {
    throw new AppError("Page and limit are required", 400);
  }

  if (page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive integers", 400);
  }

  const summary = await getSummaryByDocumentPaginated(documentId, page, limit);
  return summary;
};

/**
 * Retrieves summaries belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of summaries to retrieve per page
 * @returns An object containing the summaries and the count of summaries belonging to the user
 * @throws {AppError} If user ID is invalid or missing
 * @throws {AppError} If page or limit is invalid or missing
 * @throws {AppError} If page or limit is not a positive integer
 */
export const getSummaryByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid User ID", 400);
  }

  if (!page || !limit) {
    throw new AppError("Page and limit are required", 400);
  }

  if (page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive integers", 400);
  }

  const summary = await getSummaryByuserPaginated(userId, page, limit);
  return summary;
};

/**
 * Updates a summary
 * @param {string} id - Summary ID
 * @param {Partial<ISummary>} data - Summary data to update
 * @returns Updated summary if found, null otherwise
 * @throws {AppError} If summary ID is invalid or missing
 * @throws {AppError} If summary data is invalid or missing
 */
export const updateSummaryService = async (
  id: string,
  data: Partial<ISummary>,
) => {
  if (!id) {
    throw new AppError("Summary ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Summary ID", 400);
  }

  if (!data || typeof data !== "object") {
    throw new AppError("Data is required", 400);
  }

  const summary = await updateSummary(id, data);
  return summary;
};

/**
 * Deletes a summary by ID
 * @param {string} id - Summary ID
 * @returns Deleted summary if found, null otherwise
 * @throws {null} If the summary ID is invalid
 */
export const deleteSummaryService = async (id: string) => {
  if (!id) {
    throw new AppError("Summary ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Summary ID", 400);
  }

  const summary = await deleteSummary(id);

  if (!summary) {
    throw new AppError("Summary not found", 404);
  }

  return summary;
};
