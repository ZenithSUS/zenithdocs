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
import { getTotalSharedDocumentsByUser } from "../repositories/document-share.repository.js";
import dayjs from "dayjs";
import { getStorageByUser } from "../repositories/storage.repository.js";

/**
 * Retrieves an overview of the dashboard for a user
 * @param {string} userId - User ID
 * @returns {Promise<{totalDocuments: number, totalFolders: number, totalSummary: number, tokensUsed: number, completedDocuments: number, documentsUploaded: number}>} An object containing the total number of documents, folders, summaries, tokens used, completed documents, and uploaded documents for the user
 * @throws {AppError} If the user ID is invalid or missing
 */
export const getDashboardOverviewService = async (userId: string) => {
  const today = dayjs().format("YYYY-MM-DD");
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  const validated = getDashboardOverviewSchema.parse({ userId, month });

  const [
    // Overview Stats
    totalDocuments,
    totalFolders,
    totalSummary,
    totalSummaryTypes,
    totalSharedDocuments,

    // Usage
    usage,
    usageHistory,

    // Storage
    storageUsed,

    // Totals
    completedDocuments,
    processingDocuments,

    // Recents
    recentDocuments,
    recentSummary,
  ] = await Promise.all([
    // Overview Stats
    getTotalDocumentsByUser(validated.userId),
    getTotalFoldersByUser(validated.userId),
    getTotalSummaryByUser(validated.userId),
    getAllTotalEachSummaryTypesByUser(validated.userId),
    getTotalSharedDocumentsByUser(validated.userId),

    // Usage
    getUsageByUserAndMonth(validated.userId, validated.month),
    getLastSixMonthsUsageByUser(validated.userId),

    // Storage
    getStorageByUser(validated.userId),

    // Totals
    getTotalStatusDocumentsByUser(validated.userId, "completed"),
    getTotalStatusDocumentsByUser(validated.userId, "processing"),

    // Recents
    getRecentDocumentsByUser(validated.userId),
    getRecentSummaryByUser(validated.userId),
  ]);

  const overview = {
    // Overview Stats
    totalAIRequests: usage?.aiRequests || 0,
    totalMessages: usage?.totalMessages || 0,
    totalDocuments,
    totalFolders,
    totalSummary,
    totalSummaryTypes,

    // Usage
    totalSharedDocuments,
    documentsUploaded: usage?.documentsUploaded || 0,
    storageAdded: usage?.storageAdded || 0,
    usageHistory,
    dailyMessage: usage?.dailyMessages[today] || 0,

    // Storage
    storageUsed: storageUsed?.totalUsed || 0,

    // Totals
    completedDocuments,
    processingDocuments,

    // Recents
    recentDocuments,
    recentSummary,
  };

  return overview;
};
