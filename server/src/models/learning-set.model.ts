import { Schema, Document, Types } from "mongoose";
import { mainDB } from "../config/db.js";

export interface ILearningItem {
  type: "mcq" | "tf" | "identification" | "flashcard";

  question?: string;

  choices?: string[];

  answer: string;

  explanation?: string;

  // flashcard fields
  front?: string;
  back?: string;
}

export interface ILearningSet extends Document {
  documentId: Types.ObjectId;
  ownerId: Types.ObjectId;

  type: "quiz" | "reviewer" | "flashcard";

  title?: string;

  difficulty: "easy" | "medium" | "hard";

  items: ILearningItem[];

  chunkHashes: string[];

  isDirty: boolean;

  source: "ai" | "manual";

  createdAt: Date;
  updatedAt: Date;
}

export interface ILearningSetInput {
  documentId: string;
  ownerId: string;

  type: "quiz" | "reviewer" | "flashcard";

  title?: string;

  difficulty?: "easy" | "medium" | "hard";

  items: ILearningItem[];

  chunkHashes: string[];

  source?: "ai" | "manual";
}

const learningItemSchema = new Schema<ILearningItem>({
  type: {
    type: String,
    enum: ["mcq", "tf", "identification", "flashcard"],
    required: true,
  },

  question: {
    type: String,
    trim: true,
  },

  choices: {
    type: [String],
    validate: {
      validator: function (this: ILearningItem, value: string[]) {
        if (this.type === "mcq") {
          return Array.isArray(value) && value.length >= 2;
        }
        return true;
      },
      message: "MCQ must have at least 2 choices",
    },
  },

  answer: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        const item = this as any as ILearningItem;

        if (item.type === "mcq" && Array.isArray(item.choices)) {
          return item.choices.includes(value);
        }
        return true;
      },
      message: "Answer must be one of the choices",
    },
  },

  explanation: {
    type: String,
  },

  // flashcard
  front: {
    type: String,
  },
  back: {
    type: String,
  },
});

const learningSetSchema = new Schema<ILearningSet>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["quiz", "reviewer", "flashcard"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    items: {
      type: [learningItemSchema],
      required: true,
    },
    chunkHashes: {
      type: [String],
      required: true,
    },
    isDirty: {
      type: Boolean,
      default: false,
      index: true,
    },
    source: {
      type: String,
      enum: ["ai", "manual"],
      default: "ai",
    },
  },
  { timestamps: true },
);

learningSetSchema.index({ documentId: 1, type: 1 });
learningSetSchema.index({ ownerId: 1, createdAt: -1 });

learningSetSchema.post("findOneAndDelete", async function (doc: ILearningSet) {
  if (!doc) return;
});

learningSetSchema.post("deleteOne", async (doc: ILearningSet) => {
  if (!doc) return;
});

learningSetSchema.post("deleteMany", async (doc: ILearningSet) => {
  if (!doc) return;
});

export default mainDB.model<ILearningSet>("LearningSet", learningSetSchema);
