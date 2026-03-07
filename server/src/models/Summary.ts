import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IAdditionalDetails {
  risk: string; // e.g. "Auto-renewal clause ($4.2M)"
  action: string; // e.g. "Sign before March 1, 2024"
  entity: string[]; // e.g. ["Acme Corp", "John Doe (CEO)"]
}

export interface ISummary extends Document {
  user: Types.ObjectId;
  document: Types.ObjectId;
  type: "short" | "bullet" | "detailed" | "executive";
  content: string;
  additionalDetails: IAdditionalDetails;
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const additionalDetailsSchema = new Schema<IAdditionalDetails>(
  {
    risk: {
      type: String,
      default: "None identified",
    },
    action: {
      type: String,
      default: "No action required",
    },
    entity: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const summarySchema = new Schema<ISummary>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    type: {
      type: String,
      enum: ["short", "bullet", "detailed", "executive"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    additionalDetails: {
      type: additionalDetailsSchema,
      default: () => ({
        risk: "None identified",
        action: "No action required",
        entity: [],
      }),
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mainDB.model<ISummary>("Summary", summarySchema);
