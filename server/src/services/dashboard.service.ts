import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  getRecentDocumentsByUser,
  getTotalDocumentsByUser,
  getTotalStatusDocumentsByUser,
} from "../repositories/document.repository.js";
import { getTotalFoldersByUser } from "../repositories/folder.repository.js";
import {
  getLastSixMonthsUsage,
  getUsageByUserAndMonth,
} from "../repositories/usage.repository.js";
import {
  getRecentSummaryByUser,
  getTotalSummaryByUser,
} from "../repositories/summary.repository.js";

/**
 * Retrieves an overview of the dashboard for a user
 * @param {string} userId - User ID
 * @returns {Promise<{totalDocuments: number, totalFolders: number, totalSummary: number, tokensUsed: number, completedDocuments: number, documentsUploaded: number}>} An object containing the total number of documents, folders, summaries, tokens used, completed documents, and uploaded documents for the user
 * @throws {AppError} If the user ID is invalid or missing
 */
export const getDashboardOverviewService = async (userId: string) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const [
    totalDocuments,
    totalFolders,
    totalSummary,
    usage,
    usageHistory,
    completedDocuments,
    processingDocuments,
    recentDocuments,
    recentSummary,
  ] = await Promise.all([
    getTotalDocumentsByUser(userId),
    getTotalFoldersByUser(userId),
    getTotalSummaryByUser(userId),
    getUsageByUserAndMonth(userId, month),
    getLastSixMonthsUsage(userId),
    getTotalStatusDocumentsByUser(userId, "completed"),
    getTotalStatusDocumentsByUser(userId, "processing"),
    getRecentDocumentsByUser(userId),
    getRecentSummaryByUser(userId),
  ]);

  const overview = {
    totalDocuments,
    totalFolders,
    totalSummary,
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
