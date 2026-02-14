import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUsage extends Document {
  user: Types.ObjectId;
  month: string; // "2026-02"
  documentsUploaded: number;
  tokensUsed: number;
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
  },
  tokensUsed: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<IUsage>("Usage", usageSchema);
