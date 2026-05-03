import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";
import Summary from "./summary.model.js";
import Chat from "./chat.model.js";
import DocumentShare from "./document-share.model.js";
import LearningSet from "./learning-set.model.js";
import Message from "./message.model.js";

export interface IDocument extends Document {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  rawText: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  user: Types.ObjectId;
  folder?: Types.ObjectId | null;
  publicId: string;
  isDirty: boolean;
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
  folder?: string | null;
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
    isDirty: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ folder: 1 });

// Cascasde summary and chat when document is deleted
documentSchema.post("findOneAndDelete", async function (doc: IDocument) {
  if (!doc) return;

  await Promise.all([
    Summary.deleteMany({ document: doc._id }),
    Chat.deleteMany({ documentId: doc._id }),
    DocumentShare.deleteMany({ documentId: doc._id }),
    LearningSet.deleteMany({ documentId: doc._id }),
    Message.deleteMany({ userId: doc.user }),
  ]);
});

documentSchema.post("deleteOne", async (doc: IDocument) => {
  if (!doc) return;

  await Promise.all([
    Summary.deleteMany({ document: doc._id }),
    Chat.deleteMany({ documentId: doc._id }),
    DocumentShare.deleteMany({ documentId: doc._id }),
    LearningSet.deleteMany({ documentId: doc._id }),
    Message.deleteMany({ userId: doc.user }),
  ]);
});

documentSchema.post("deleteMany", async (doc: IDocument) => {
  if (!doc) return;

  await Promise.all([
    Summary.deleteMany({ document: doc._id }),
    Chat.deleteMany({ documentId: doc._id }),
    DocumentShare.deleteMany({ documentId: doc._id }),
    LearningSet.deleteMany({ documentId: doc._id }),
    Message.deleteMany({ userId: doc.user }),
  ]);
});

export default mainDB.model<IDocument>("Document", documentSchema);
