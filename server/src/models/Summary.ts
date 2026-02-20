import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISummary extends Document {
  document: Types.ObjectId;
  type: "short" | "bullet" | "detailed" | "executive";
  content: string;
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const summarySchema = new Schema<ISummary>(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    type: {
      type: String,
      enum: ["short", "bullet", "detailed", "executive"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

summarySchema.index({ document: 1, type: 1 }, { unique: true });

export default mongoose.model<ISummary>("Summary", summarySchema);
