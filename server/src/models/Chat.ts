import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IChat extends Document {
  documentId: Types.ObjectId;
  userId: Types.ObjectId;
  messages: IMessage[];
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IChatInput {
  documentId: string;
  userId: string;
}

export interface IMessageInput {
  role: "user" | "assistant";
  content: string;
}

const messageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    messages: {
      type: [messageSchema],
      default: [],
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
