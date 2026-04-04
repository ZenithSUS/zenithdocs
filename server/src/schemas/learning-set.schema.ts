import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const createLearningSetRequestSchema = z.object({
  ownerId: objectId,
  documentId: objectId,
  type: z.enum(["quiz", "reviewer", "flashcard"]),
  itemType: z
    .enum(["general", "mcq", "tf", "identification", "flashcard"])
    .default("general"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  title: z.string().max(100, "Title is too long").optional(),
  role: z.enum(["user", "admin"]),
});

export const learningSetParamsSchema = z.object({
  learningSetId: objectId,
});

const learningItemSchema = z
  .object({
    type: z.enum(["mcq", "tf", "identification", "flashcard"]),
    question: z.string().min(1).optional(),
    choices: z.array(z.string()).optional(),
    answer: z.string().min(1, "Answer is required."),
    explanation: z.string().optional(),
    front: z.string().optional(),
    back: z.string().optional(),
  })
  .superRefine((item, ctx) => {
    if (item.type !== "flashcard" && !item.question) {
      ctx.addIssue({
        code: "custom",
        message: "Question is required for non-flashcard items.",
        path: ["question"],
      });
    }

    if (item.type === "mcq" && (!item.choices || item.choices.length < 2)) {
      ctx.addIssue({
        code: "custom",
        message: "MCQ must have at least 2 choices.",
        path: ["choices"],
      });
    }

    if (item.type === "flashcard") {
      if (!item.front) {
        ctx.addIssue({
          code: "custom",
          message: "Flashcard must have a front.",
          path: ["front"],
        });
      }
      if (!item.back) {
        ctx.addIssue({
          code: "custom",
          message: "Flashcard must have a back.",
          path: ["back"],
        });
      }
    }
  });

export const createLearningSetSchema = z.object({
  documentId: objectId,
  ownerId: objectId,
  type: z.enum(["quiz", "reviewer", "flashcard"]),
  title: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  items: z.array(learningItemSchema),
  chunkHashes: z.array(z.string()),
  source: z.enum(["ai", "manual"]).optional(),
});

export const getLearningSetByUserPageSchema = z.object({
  userId: objectId,
  ...paginationFields,
});

export const updateLearningSetSchema = createLearningSetSchema.partial();
