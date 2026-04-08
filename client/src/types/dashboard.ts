import { Summary } from "@/types/summary";
import { Usage } from "./usage";
import Doc from "./doc";

export type DashboardOverview = {
  totalAIRequests: number;
  totalMessages: number;
  totalDocuments: number;
  totalFolders: number;
  totalSummary: number;
  totalSummaryTypes: {
    _id: string;
    count: number;
  }[];
  totalSharedDocuments: number;
  usageHistory: Usage[];
  completedDocuments: number;
  documentsUploaded: number;
  dailyMessage: number;
  storageUsed: number;
  processingDocuments: number;
  recentDocuments: Doc[];
  recentSummary: Summary[];
};
