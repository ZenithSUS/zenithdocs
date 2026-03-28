import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const learningSetParamsSchema = z.object({
  learningSetId: objectId,
});

export const createLearningSetSchema = z.object({
  documentId: objectId,
  ownerId: objectId,
  type: z.enum(["quiz", "reviewer", "flashcard"]),
  title: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  items: z.array(
    z
      .object({
        type: z.enum(["mcq", "tf", "identification", "flashcard"]),
        question: z.string().min(1, "Question is required.").optional(),
        choices: z.array(z.string()).optional(),
        answer: z.string().min(1, "Answer is required."),
        explanation: z.string().optional(),

        // flashcard fields
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

        if (item.type === "mcq" && !item.choices) {
          ctx.addIssue({
            code: "custom",
            message: "MCQ must have at least 2 choices.",
            path: ["choices"],
          });
        }

        if (item.type === "flashcard" && (!item.front || !item.back)) {
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
      }),
  ),
  chunkHashes: z.array(z.string()),
  source: z.enum(["ai", "manual"]).optional(),
});

export const getLearningSetByUserPageSchema = z.object({
  userId: objectId,
  ...paginationFields,
});

export const updateLearningSetSchema = createLearningSetSchema.partial();
