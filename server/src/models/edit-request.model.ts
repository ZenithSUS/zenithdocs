import { Schema, Types, Document } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IEditRequest extends Document {
  documentId: Types.ObjectId;
  ownerId: Types.ObjectId;

  requesterId?: Types.ObjectId;
  email?: string;

  message?: string;

  status: "pending" | "approved" | "rejected";

  createdAt: Date;
  updatedAt: Date;
}

const editRequestSchema = new Schema<IEditRequest>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mainDB.model<IEditRequest>("EditRequest", editRequestSchema);
