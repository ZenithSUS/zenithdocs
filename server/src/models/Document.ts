import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDocument extends Document {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  user: Types.ObjectId;
  folder?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    rawText: {
      type: String,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDocument>("Document", documentSchema);
