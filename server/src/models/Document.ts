import mongoose, { Schema, Document, Types } from "mongoose";
import Summary, { ISummary } from "./Summary.js";

export interface IChunk {
  text: string;
  embedding: number[];
}

export interface IDocument extends Document {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  chunks?: IChunk[];
  status: "uploaded" | "processing" | "completed" | "failed";
  user: Types.ObjectId;
  folder?: Types.ObjectId;
  publicId: string;
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
    chunks: [
      {
        text: { type: String },
        embedding: { type: [Number] },
      },
    ],
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
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ folder: 1 });

// Cascasde summary when document is deleted
documentSchema.post("findOneAndDelete", async (doc: ISummary) => {
  await Summary.deleteMany({ document: doc._id });
});

documentSchema.post("deleteOne", async (doc: ISummary) => {
  await Summary.deleteMany({ document: doc._id });
});

documentSchema.post("deleteMany", async (doc: ISummary) => {
  await Summary.deleteMany({ document: doc._id });
});

export default mongoose.model<IDocument>("Document", documentSchema);
