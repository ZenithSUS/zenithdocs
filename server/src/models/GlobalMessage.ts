import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IGlobalMessage extends Document {
  chatId: Types.ObjectId; // Reference to the user's global chat
  userId: Types.ObjectId; // Who sent it
  role: "user" | "assistant"; // Message role
  content: string; // User question or AI answer
  relatedDocumentIds?: Types.ObjectId[]; // Optional: documents relevant to this message
  comparisonDocumentIds?: Types.ObjectId[]; // Optional: for document comparisons
  embedding?: number[]; // Optional embedding for semantic search
  confidenceScore: number; // The accuracy of the response
  createdAt: Date;
}

export interface IGlobalMessageInput {
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  relatedDocumentIds?: string[];
  comparisonDocumentIds?: string[];
  embedding?: number[]; // Optional embedding for semantic search (for user message only)
  confidenceScore?: number; // Optional for show accuracy (for assistant message only)
}

const globalMessageSchema = new Schema<IGlobalMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "GlobalChat", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    relatedDocumentIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    comparisonDocumentIds: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    embedding: { type: [Number], default: [] },
    confidenceScore: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

globalMessageSchema.index({ chatId: 1 });
globalMessageSchema.index({ userId: 1, chatId: 1 });

export default mainDB.model<IGlobalMessage>(
  "GlobalMessage",
  globalMessageSchema,
);
