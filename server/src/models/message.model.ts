import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  userId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
  createdAt: Date;
}

export interface MessageInput {
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
  createdAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: false,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

messageSchema.index({ chatId: 1 });
messageSchema.index({ userId: 1, chatId: 1 });

export default mainDB.model<IMessage>("Message", messageSchema);
