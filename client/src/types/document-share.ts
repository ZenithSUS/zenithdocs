export interface DocumentShare {
  _id: string;
  documentId: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  };
  ownerId: {
    _id: string;
    email: string;
  };
  type: "public" | "private";
  shareToken?: string;
  publicPermission?: "read" | "write";
  allowedUsers?: {
    userId: {
      _id: string;
      email: string;
    };
    permission: "read" | "write";
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
  publicPermission?: "read" | "write";
  allowedUsers?: {
    userId: string;
    permission: "read" | "write";
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
