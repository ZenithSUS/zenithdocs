export interface DocumentShare {
  _id: string;
  documentId: string;
  ownerId: string;
  type: "public" | "private";
  shareToken?: string;
  publicPermission?: "read" | "write";
  allowedUsers?: {
    userId: string;
    permission: "read" | "write";
  }[];
  permission: "read" | "write";
  isActive: boolean;
  expiresAt?: Date;
  allowDownload: boolean;
  accessCount?: number;
  lastAccessedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentShareInput {
  documentId: string;
  ownerId: string;
  type: "public" | "private";
  publicPermission?: "read" | "write";
  allowedUsers?: {
    userId: string;
    permission: "read" | "write";
  }[];
  allowDownload?: boolean;
  expiresAt?: string;
}
