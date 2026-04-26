import { Schema, Types } from "mongoose";
import Document, { IDocument } from "./document.model.js";
import { mainDB } from "../config/db.js";

export interface IFolder extends Document {
  name: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFolderInput {
  name: string;
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
folderSchema.index({ user: 1, createdAt: -1 });

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
