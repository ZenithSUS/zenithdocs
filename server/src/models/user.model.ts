import { Schema, Document } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IUser extends Document {
  email: string;
  password?: string;
  role: "user" | "admin";
  plan: "free" | "premium";
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mainDB.model<IUser>("User", userSchema);
