import { summarizeText } from "../lib/mistral/services/document-summary.service.js";
import { ISummary } from "../models/summary.model.js";
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
import {
  incrementOnlyAIRequests,
  updateUsageMonthByUser,
} from "../repositories/usage.repository.js";
import { generateEmbedding } from "../lib/mistral/services/embedding.service.js";
import { getSimilaritySummaryScore } from "../repositories/document-chunk.repository.js";

import {
  summaryParamsSchema,
  documentParamsSchema,
  createSummarySchema,
  updateSummarySchema,
  getSummaryByDocumentPaginatedSchema,
  getSummaryByUserPaginatedSchema,
} from "../schemas/summary.schema.js";

/**
 * Creates a new summary with the given data.
 * The usage limit for the current user will be checked and an error will be thrown if the limit is exceeded.
 * The type of summary to generate is specified by the "type" property of the data object.
 * The type of summary can be one of the following:
 *   - short: main points overview summary
 *   - bullet: key facts insights bullet points
 *   - detailed: detailed explanation arguments conclusions
 *   - executive: strategic impact business implications recommendations
 * If the query is empty, the summary type will be used as the query to generate the summary.
 * @param {Partial<ISummary>} data - Partial summary data
 * @returns {Promise<ISummary>} The created summary
 * @throws {AppError} If the query is empty or if the usage limit is exceeded
 */
export const createSummaryService = async (data: Partial<ISummary>) => {
  const month = new Date().toISOString().slice(0, 7);
  const validated = createSummarySchema.parse(data);

  const usageLimit = await updateUsageMonthByUser(validated.user, month);

  if (!usageLimit.user || typeof usageLimit.user === "string") {
    throw new AppError("User not populated properly", 500);
  }

  if (!("plan" in usageLimit.user)) {
    throw new AppError("User plan not found", 500);
  }

  const summaryQueries: Record<ISummary["type"], string> = {
    short: "main points overview summary",
    bullet: "key facts insights bullet points",
    detailed: "detailed explanation arguments conclusions",
    executive: "strategic impact business implications recommendations",
  };

  const query = summaryQueries[validated.type];
  const queryEmbedding = await generateEmbedding(query);
  const chunks = await getSimilaritySummaryScore(
    queryEmbedding,
    validated.document,
    0.0,
  );

  const sortedChunks = [...chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);
  const contentFromChunks = sortedChunks.map((c) => c.text).join("\n\n");
  const contentToSummarize =
    contentFromChunks.length > 0 ? contentFromChunks : query;

  const { content, tokensUsed, additionalDetails } = await summarizeText(
    contentToSummarize,
    validated.type,
  );

  await incrementOnlyAIRequests(validated.user, tokensUsed);

  const summary = await createSummary({
    user: validated.user,
    document: validated.document,
    type: validated.type,
    content: content.toString(),
    additionalDetails,
    tokensUsed,
  });

  const populatedSummary = await getSummaryById(summary._id.toString());
  if (!populatedSummary) throw new AppError("Summary not found", 500);

  return populatedSummary;
};

/**
 * Retrieves all summaries from the database. - Admin Only
 * @param {"user" | "admin"} role - User role
 * @returns {Promise<ISummary[]>} An array of all summaries
 */
export const getAllSummaryService = async (role: "user" | "admin") => {
  if (role !== "admin") throw new AppError("Forbidden", 403);
  return await getAllSummary();
};

/**
 * Retrieves a single summary by its ID.
 * @param {string} id - Summary ID
 * @returns {Promise<ISummary>} The retrieved summary
 * @throws {AppError} If the summary ID is invalid or if the summary is not found
 */
export const getSummaryByIdService = async (id: string) => {
  const { summaryId } = summaryParamsSchema.parse({ summaryId: id });
  const summary = await getSummaryById(summaryId);
  if (!summary) throw new AppError("Summary not found", 404);
  return summary;
};

/**
 * Retrieves all summaries belonging to a document
 * @param {string} documentId - Document ID
 * @returns {Promise<ISummary[]>} An array of summaries belonging to the document
 * @throws {AppError} If the document ID is invalid
 */
export const getSummaryByDocumentService = async (documentId: string) => {
  const validated = documentParamsSchema.parse({ documentId });
  return await getSummaryByDocument(validated.documentId);
};

/**
 * Retrieves all summaries belonging to a document in a paginated manner
 * @param {string} documentId - Document ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of summaries to retrieve per page
 * @returns {Promise<{summaries: ISummary[], pagination: {page: number, limit: number, total: number, totalPages: number}>} An object containing the summaries and the count of summaries belonging to the document
 * @throws {AppError} If the document ID is invalid
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const getSummarByDocumentyPaginatedService = async (
  documentId: string,
  page: number,
  limit: number,
) => {
  const validated = getSummaryByDocumentPaginatedSchema.parse({
    documentId,
    page,
    limit,
  });
  return await getSummaryByDocumentPaginated(
    validated.documentId,
    validated.page,
    validated.limit,
  );
};

/**
 * Retrieves all summaries belonging to a user in a paginated manner
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of summaries to retrieve per page
 * @returns An object containing the summaries and the count of summaries belonging to the user
 * @throws {AppError} If the user ID is invalid
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const getSummaryByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getSummaryByUserPaginatedSchema.parse({
    userId,
    page,
    limit,
  });
  return await getSummaryByuserPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );
};

/**
 * Updates a summary
 * @param {string} id - Summary ID
 * @param {Partial<ISummary>} data - Data to update
 * @returns Updated summary if found, null otherwise
 * @throws {AppError} If the summary ID is invalid or missing
 * @throws {AppError} If the page number or limit is invalid or missing
 * @throws {AppError} If the page number or limit is not a positive integer
 */
export const updateSummaryService = async (
  id: string,
  data: Partial<ISummary>,
) => {
  const validated = updateSummarySchema.parse({ summaryId: id, data });
  const summary = await updateSummary(validated.summaryId, validated.data);
  if (!summary) throw new AppError("Summary not found", 404);
  return summary;
};

/**
 * Deletes a summary by ID
 * @param {string} id - Summary ID
 * @returns Deleted summary if found, null otherwise
 * @throws {AppError} If the summary ID is invalid or missing
 * @throws {AppError} If the summary is not found
 */
export const deleteSummaryService = async (id: string) => {
  const { summaryId } = summaryParamsSchema.parse({ summaryId: id });
  const summary = await deleteSummary(summaryId);
  if (!summary) throw new AppError("Summary not found", 404);
  return summary;
};
