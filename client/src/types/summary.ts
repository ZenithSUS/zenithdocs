export type SummaryType = "short" | "bullet" | "detailed" | "executive";

export interface Summary {
  _id: string;
  user: string;
  document:
    | string
    | {
        _id: string;
        title: string;
        fileType: string;
        fileSize: number;
      };
  type: SummaryType;
  content: string;
  additionalDetails: {
    risk: string;
    action: string;
    entity: string[];
  };
  tokensUsed: number;
  createdAt: string;
}
