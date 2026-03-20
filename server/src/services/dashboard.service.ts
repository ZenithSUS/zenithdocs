import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  getRecentDocumentsByUser,
  getTotalDocumentsByUser,
  getTotalStatusDocumentsByUser,
} from "../repositories/document.repository.js";
import { getTotalFoldersByUser } from "../repositories/folder.repository.js";
import {
  getLastSixMonthsUsageByUser,
  getUsageByUserAndMonth,
} from "../repositories/usage.repository.js";
import {
  getAllTotalEachSummaryTypesByUser,
  getRecentSummaryByUser,
  getTotalSummaryByUser,
} from "../repositories/summary.repository.js";
import { getDashboardOverviewSchema } from "../schemas/dashboard.schema.js";

/**
 * Retrieves an overview of the dashboard for a user
 * @param {string} userId - User ID
 * @returns {Promise<{totalDocuments: number, totalFolders: number, totalSummary: number, tokensUsed: number, completedDocuments: number, documentsUploaded: number}>} An object containing the total number of documents, folders, summaries, tokens used, completed documents, and uploaded documents for the user
 * @throws {AppError} If the user ID is invalid or missing
 */
export const getDashboardOverviewService = async (userId: string) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  const validated = getDashboardOverviewSchema.parse({ userId, month });

  const [
    totalDocuments,
    totalFolders,
    totalSummary,
    totalSummaryTypes,
    usage,
    usageHistory,
    completedDocuments,
    processingDocuments,
    recentDocuments,
    recentSummary,
  ] = await Promise.all([
    getTotalDocumentsByUser(validated.userId),
    getTotalFoldersByUser(validated.userId),
    getTotalSummaryByUser(validated.userId),
    getAllTotalEachSummaryTypesByUser(validated.userId),
    getUsageByUserAndMonth(validated.userId, month),
    getLastSixMonthsUsageByUser(validated.userId),
    getTotalStatusDocumentsByUser(validated.userId, "completed"),
    getTotalStatusDocumentsByUser(validated.userId, "processing"),
    getRecentDocumentsByUser(validated.userId),
    getRecentSummaryByUser(validated.userId),
  ]);

  const overview = {
    totalDocuments,
    totalFolders,
    totalSummary,
    totalSummaryTypes,
    tokensUsed: usage?.tokensUsed || 0,
    documentsUploaded: usage?.documentsUploaded || 0,
    completedDocuments,
    usageHistory,
    processingDocuments,
    recentDocuments,
    recentSummary,
  };

  return overview;
};
