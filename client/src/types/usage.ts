export interface Usage {
  month: string;
  documentsUploaded: number;
  tokensUsed: number;
}

export interface UsageResponse {
  success: boolean;
  message: string;
  data: Usage[];
}
