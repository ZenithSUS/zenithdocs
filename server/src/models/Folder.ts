import { Schema, Types } from "mongoose";
import Document, { IDocument } from "./Document.js";
import { mainDB } from "../config/db.js";

export interface IFolder extends Document {
  name: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

folderSchema.index({ user: 1, name: 1 }, { unique: true });

// Update documents when a folder is deleted
folderSchema.post("findOneAndDelete", async (doc: IDocument) => {
  if (doc) {
    await Document.updateMany({ folder: doc._id }, { $set: { folder: null } });
  }
});

folderSchema.post("deleteMany", async (doc: IDocument) => {
  if (doc) {
    await Document.updateMany({ folder: doc._id }, { $set: { folder: null } });
  }
});

folderSchema.post("deleteOne", async (doc: IDocument) => {
  if (doc) {
    await Document.updateMany({ folder: doc._id }, { $set: { folder: null } });
  }
});

export default mainDB.model<IFolder>("Folder", folderSchema);
