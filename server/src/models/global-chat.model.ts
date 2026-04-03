import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";
import GlobalMessage from "./global-message.model.js";

export interface IGlobalChat extends Document {
  userId: Types.ObjectId;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const globalChatSchema = new Schema<IGlobalChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

globalChatSchema.index({ userId: 1 }, { unique: true });

// cascade message delete associated with the global chat
globalChatSchema.post("findOneAndDelete", async (doc: IGlobalChat) => {
  if (!doc) return;
  await GlobalMessage.deleteMany({ chatId: doc._id });
});

globalChatSchema.post("deleteMany", async (doc: IGlobalChat) => {
  if (!doc) return;
  await GlobalMessage.deleteMany({ chatId: doc._id });
});

globalChatSchema.post("deleteOne", async (doc: IGlobalChat) => {
  if (!doc) return;
  await GlobalMessage.deleteMany({ chatId: doc._id });
});

export default mainDB.model<IGlobalChat>("GlobalChat", globalChatSchema);
