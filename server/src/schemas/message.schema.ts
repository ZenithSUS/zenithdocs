import z from "zod";
import { objectId } from "../utils/zod.utils.js";

export const getMessagesByChatPageSchema = z.object({
  chatId: objectId,
  page: z
    .number()
    .min(1)
    .default(1)
    .refine((page) => page > 0, {
      message: "Page must be a positive number.",
    }),
  limit: z
    .number()
    .min(1)
    .default(10)
    .refine((limit) => limit > 0, {
      message: "Limit must be a positive number.",
    }),
});

export const deleteMessagesByChatAndUserSchema = z.object({
  chatId: objectId,
  userId: objectId,
});
