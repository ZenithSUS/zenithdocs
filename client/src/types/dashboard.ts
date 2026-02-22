import Doc from "@/types/doc";
import { Summary } from "@/types/summary";
import { Usage } from "./usage";

export type DashboardOverview = {
  totalDocuments: number;
  totalFolders: number;
  totalSummary: number;
  tokensUsed: number;
  usageHistory: Usage[];
  completedDocuments: number;
  documentsUploaded: number;
  processingDocuments: number;
  recentDocuments: (Doc & {
    folder?: {
      _id: string;
      title: string;
    } | null;
  })[];
  recentSummary: Summary[];
};
