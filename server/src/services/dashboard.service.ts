import redis from "../config/redis.js";
import CacheKeys from "../config/cache-keys.js";
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
import { IUsage } from "../models/usage.model.js";
import { IDocument } from "../models/document.model.js";
import { ISummary, SummaryTypeCount } from "../models/summary.model.js";

export interface IDashboardOverview {
  // Overview Stats
  totalAIRequests: number;
  totalMessages: number;
  totalDocuments: number;
  totalFolders: number;
  totalSummary: number;
  totalSummaryTypes: SummaryTypeCount[] | null;

  // Usage
  totalSharedDocuments: number;
  documentsUploaded: number;
  storageAdded: number;
  usageHistory: IUsage[];
  dailyMessage: number;

  // Storage
  storageUsed: number;

  // Totals
  completedDocuments: number;
  processingDocuments: number;

  // Recents
  recentDocuments: IDocument[];
  recentSummary: ISummary[];
}

/**
 * Retrieves the dashboard overview for a user based on their ID.
 * @param {string} userId - The ID of the user to retrieve dashboard overview for.
 * @returns {Promise<IDashboardOverview>} The dashboard overview for the user.
 */
export const getDashboardOverviewService = async (
  userId: string,
): Promise<IDashboardOverview> => {
  const today = dayjs().format("YYYY-MM-DD");
  const month = new Date().toISOString().slice(0, 7);
  const validated = getDashboardOverviewSchema.parse({ userId, month });

  // ─── Stable data — cache for 5 minutes ────────────────────────
  const stableCacheKey = CacheKeys.dashboardStable(validated.userId);
  const cachedStable = await redis.get(stableCacheKey);

  const stable = cachedStable
    ? JSON.parse(cachedStable)
    : await (async () => {
        const [
          totalDocuments,
          totalFolders,
          totalSummary,
          totalSummaryTypes,
          totalSharedDocuments,
          storageUsed,
          completedDocuments,
          processingDocuments,
          recentDocuments,
          recentSummary,
        ] = await Promise.all([
          getTotalDocumentsByUser(validated.userId),
          getTotalFoldersByUser(validated.userId),
          getTotalSummaryByUser(validated.userId),
          getAllTotalEachSummaryTypesByUser(validated.userId),
          getTotalSharedDocumentsByUser(validated.userId),
          getStorageByUser(validated.userId),
          getTotalStatusDocumentsByUser(validated.userId, "completed"),
          getTotalStatusDocumentsByUser(validated.userId, "processing"),
          getRecentDocumentsByUser(validated.userId),
          getRecentSummaryByUser(validated.userId),
        ]);

        const data = {
          totalDocuments,
          totalFolders,
          totalSummary,
          totalSummaryTypes,
          totalSharedDocuments,
          storageUsed: storageUsed?.totalUsed || 0,
          completedDocuments,
          processingDocuments,
          recentDocuments,
          recentSummary,
        };

        await redis.setex(stableCacheKey, 300, JSON.stringify(data)); // 5 min
        return data;
      })();

  // ─── Live data — always fresh ──────────────────────────────────
  const [usage, usageHistory] = await Promise.all([
    getUsageByUserAndMonth(validated.userId, validated.month),
    getLastSixMonthsUsageByUser(validated.userId),
  ]);

  return {
    ...stable,
    totalAIRequests: usage?.aiRequests || 0,
    totalMessages: usage?.totalMessages || 0,
    documentsUploaded: usage?.documentsUploaded || 0,
    storageAdded: usage?.storageAdded || 0,
    dailyMessage: usage?.dailyMessages[today] || 0,
    usageHistory,
  };
};
