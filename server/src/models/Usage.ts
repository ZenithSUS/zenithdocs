import mongoose, { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IUsage extends Document {
  user: Types.ObjectId;
  month: string; // "2026-02"
  documentsUploaded: number;
  tokensUsed: number;
}

export interface IUsagePopulated extends Omit<IUsage, "user"> {
  user: {
    _id: string;
    email: string;
    plan: string;
  };
}

const usageSchema = new Schema<IUsage>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  documentsUploaded: {
    type: Number,
    default: 0,
    min: 0,
  },
  tokensUsed: {
    type: Number,
    default: 0,
    min: 0,
  },
});

usageSchema.index({ user: 1, month: 1 }, { unique: true });

export default mainDB.model<IUsage>("Usage", usageSchema);
