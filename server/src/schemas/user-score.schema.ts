import z from "zod";
import { objectId } from "../utils/zod.utils.js";

export const userScoreParamsSchema = z.object({
  userScoreId: objectId,
});

export const createUserScoreSchema = z.object({
  userId: objectId,
  learningSetId: objectId,
  score: z.number().min(0),
  total: z.number().min(0),
  correct: z.number().min(0),
  completedAt: z.coerce.date().optional(),
  history: z.array(
    z.object({
      itemId: objectId,
      answeredAt: z.coerce.date(),
      correct: z.boolean(),
    }),
  ),
});

export const getUserScoreByUserAndLearningSetSchema = z.object({
  userId: objectId,
  learningSetId: objectId,
});

export const updateUserScoreSchema = createUserScoreSchema.partial();
