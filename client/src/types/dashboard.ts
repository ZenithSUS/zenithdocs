import { Summary } from "@/types/summary";
import { Usage } from "./usage";
import Doc from "./doc";

export type DashboardOverview = {
  // Overview
  totalAIRequests: number;
  totalMessages: number;
  totalDocuments: number;
  totalFolders: number;
  totalSummary: number;
  totalSummaryTypes: {
    _id: string;
    count: number;
  }[];

  // Usage
  totalSharedDocuments: number;
  documentsUploaded: number;
  storageAdded: number;
  usageHistory: Usage[];
  dailyMessage: number;

  // Storage
  storageUsed: number;

  // Totals
  completedDocuments: number;
  processingDocuments: number;

  // Recents
  recentDocuments: Doc[];
  recentSummary: Summary[];
};
