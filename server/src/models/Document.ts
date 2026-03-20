import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";
import Summary from "./Summary.js";
import Chat from "./Chat.js";

export interface IDocument extends Document {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  user: Types.ObjectId;
  folder?: Types.ObjectId;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentInput {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  user: string;
  folder?: string;
  status?: "uploaded" | "processing" | "completed" | "failed";
  publicId: string;
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
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ folder: 1 });

// Cascasde summary and chat when document is deleted
documentSchema.post("findOneAndDelete", async function (doc: IDocument) {
  if (!doc) return;

  await Summary.deleteMany({ document: doc._id });
  await Chat.deleteMany({ documentId: doc._id });
});

documentSchema.post("deleteOne", async (doc: IDocument) => {
  if (!doc) return;

  await Summary.deleteMany({ document: doc._id });
  await Chat.deleteMany({ documentId: doc._id });
});

documentSchema.post("deleteMany", async (doc: IDocument) => {
  if (!doc) return;

  await Summary.deleteMany({ document: doc._id });
  await Chat.deleteMany({ documentId: doc._id });
});

export default mainDB.model<IDocument>("Document", documentSchema);
