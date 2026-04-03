import { Document, Schema, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  token: string;
  device?: string;
  ip?: string;
  createdAt: Date;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },

    device: {
      type: String,
    },
    ip: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Auto Delete Expired Tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mainDB.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
