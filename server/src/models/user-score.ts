import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface IUserScore extends Document {
  userId: Types.ObjectId;
  learningSetId: Types.ObjectId;

  score: number; // 0-100 or raw correct count
  total: number; // total items attempted
  correct: number; // correct answers
  completedAt?: Date;

  history: {
    itemId: Types.ObjectId; // reference to the learning item
    answeredAt: Date;
    correct: boolean;
  }[];
}

const userScoreSchema = new Schema<IUserScore>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    learningSetId: {
      type: Schema.Types.ObjectId,
      ref: "LearningSet",
      required: true,
      index: true,
    },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    completedAt: { type: Date },
    history: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        answeredAt: { type: Date, default: Date.now },
        correct: { type: Boolean, required: true },
      },
    ],
  },
  { timestamps: true },
);

userScoreSchema.index({ userId: 1, learningSetId: 1 }, { unique: true });

export default mainDB.model<IUserScore>("UserScore", userScoreSchema);
