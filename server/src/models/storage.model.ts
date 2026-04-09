import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IStorage extends Document {
  user: Types.ObjectId;
  totalUsed: number; // bytes (recommended)
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorageInput {
  user: string;
  totalUsed: number;
}

const storageSchema = new Schema<IStorage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

storageSchema.index({ user: 1 }, { unique: true });

export default mainDB.model<IStorage>("Storage", storageSchema);
