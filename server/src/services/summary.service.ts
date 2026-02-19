import { ISummary } from "../models/Summary.js";
import {
  createSummary,
  deleteSummary,
  getAllSummary,
  getSummaryByDocument,
  getSummaryByDocumentPaginated,
  getSummaryById,
  updateSummary,
} from "../repositories/summary.repository.js";
import AppError from "../utils/app-error.js";

/**
 * Creates a new summary with the given data
 * @param {Partial<ISummary>} data - Summary data to create
 * @returns The created summary
 * @throws {MongooseError} If summary data is invalid
 */
export const createSummaryService = async (data: Partial<ISummary>) => {
  if (!data || typeof data !== "object") {
    throw new AppError("Data is required", 400);
  }

  const summary = await createSummary(data);
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
 * @param {string} id - The summary ID to retrieve
 * @returns The retrieved summary if found, null otherwise
 * @throws {null} If the summary ID is invalid
 */
export const getSummaryByIdService = async (id: string) => {
  if (!id) {
    throw new Error("Summary ID is required");
  }

  const summary = await getSummaryById(id);
  return summary;
};

/**
 * Retrieves summaries belonging to a document
 * @param {string} documentId - Document ID
 * @returns An array of summaries belonging to the document
 * @throws {null} If the document ID is invalid
 */
export const getSummaryByDocumentService = async (documentId: string) => {
  if (!documentId) {
    throw new Error("Document ID is required");
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
 * @throws {null} If the document ID is invalid
 */
export const getSummarByDocumentyPaginatedService = async (
  documentId: string,
  page: number,
  limit: number,
) => {
  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!page || !limit) {
    throw new AppError("Page and limit are required", 400);
  }

  const summary = await getSummaryByDocumentPaginated(documentId, page, limit);
  return summary;
};

/**
 * Updates a summary by ID
 * @param {string} id - Summary ID
 * @param {Partial<ISummary>} data - Summary data to update
 * @returns Updated summary if found, null otherwise
 * @throws {null} If the summary ID is invalid
 */
export const updateSummaryService = async (
  id: string,
  data: Partial<ISummary>,
) => {
  if (!id) {
    throw new AppError("Summary ID is required", 400);
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

  const summary = await deleteSummary(id);
  return summary;
};
