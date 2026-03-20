import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IChat extends Document {
  documentId: Types.ObjectId;
  userId: Types.ObjectId;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatInput {
  documentId: string;
  userId: string;
}

export type InitChatInput = IChatInput & { summary: string };

const chatSchema = new Schema<IChat>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

chatSchema.index({ documentId: 1, userId: 1 }, { unique: true });

export default mainDB.model<IChat>("Chat", chatSchema);
