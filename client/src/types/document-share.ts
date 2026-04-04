export interface DocumentShare {
  _id: string;
  documentId: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    rawText?: string;
  };
  ownerId: {
    _id: string;
    email: string;
  };
  type: "public" | "private";
  shareToken?: string;
  publicPermission?: "read";
  allowedUsers?: {
    userId: {
      _id: string;
      email: string;
    };
    permission: "read";
  }[];
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
  publicPermission?: "read";
  allowedUsers?: {
    userId: string;
    permission: "read";
  }[];
  allowDownload?: boolean;
  expiresAt?: string | null;
}

export type UpdateDocumentShareInput = Partial<
  Omit<DocumentShareInput, "documentId">
> & {
  documentId?: string;
  isActive?: boolean;
  expiresAt?: string | null;
};
