import { z } from "zod";
import { objectId } from "../utils/zod.utils.js";

export const globalChatParamsSchema = z.object({
  userId: objectId,
});

export const globalChatAuthSchema = z.object({
  userId: objectId,
  currentUserId: objectId,
});

export const globalChatUserSchema = z.object({
  userId: objectId,
  question: z.string().min(1, "Question is required."),
});
