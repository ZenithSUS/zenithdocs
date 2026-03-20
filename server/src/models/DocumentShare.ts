import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IDocumentShare extends Document {
  documentId: Types.ObjectId;
  ownerId: Types.ObjectId;

  type: "public" | "private";

  // public access
  shareToken?: string;
  publicPermission?: "read" | "write";

  // private access
  allowedUsers?: {
    userId: Types.ObjectId;
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

export interface IDocumentShareInput {
  documentId: string;
  ownerId: string;
  type: "public" | "private";
  shareToken?: string;
  publicPermission?: "read" | "write";
  allowedUsers?: {
    userId: string;
    permission: "read" | "write";
  }[];
  isActive: boolean;
  expiresAt?: Date;
  allowDownload: boolean;
}

const documentShareSchema = new Schema<IDocumentShare>({
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  shareToken: {
    type: String,
  },
  publicPermission: {
    type: String,
    enum: ["read", "write"],
  },
  allowedUsers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      permission: {
        type: String,
        enum: ["read", "write"],
        required: true,
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  allowDownload: {
    type: Boolean,
    default: true,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  lastAccessedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

documentShareSchema.index({ documentId: 1, ownerId: 1 }, { unique: true });
documentShareSchema.index({ shareToken: 1 }, { unique: true });

export default mainDB.model<IDocumentShare>(
  "DocumentShare",
  documentShareSchema,
);
