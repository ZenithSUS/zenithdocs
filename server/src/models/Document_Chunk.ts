import mongoose, { Document, Schema, Types } from "mongoose";

export interface IDocumentChunk extends Document {
  documentId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  embedding: number[];
  chunkIndex: number;
  createdAt: Date;
}

export interface IDocumentChunkInput {
  documentId: string;
  userId: string;
  text: string;
  embedding: number[];
  chunkIndex: number;
}

const documentChunkSchema = new Schema<IDocumentChunk>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number], // 512 length
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IDocumentChunk>(
  "DocumentChunk",
  documentChunkSchema,
);
