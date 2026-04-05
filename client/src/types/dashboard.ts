import { Summary } from "@/types/summary";
import { Usage } from "./usage";
import Doc from "./doc";

export type DashboardOverview = {
  totalDocuments: number;
  totalFolders: number;
  totalSummary: number;
  totalSummaryTypes: {
    _id: string;
    count: number;
  }[];
  tokensUsed: number;
  usageHistory: Usage[];
  completedDocuments: number;
  documentsUploaded: number;
  processingDocuments: number;
  recentDocuments: Doc[];
  recentSummary: Summary[];
};
