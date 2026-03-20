import z from "zod";
import { objectId } from "../utils/zod.utils.js";

export const initChatDocumentSchema = z.object({
  documentId: objectId,
  userId: objectId,
});

export const getChatByDocumentSchema = z.object({
  documentId: objectId,
  userId: objectId,
});

export const getChatByUserSchema = z.object({
  userId: objectId,
});

export const getChatByUserPageSchema = z.object({
  userId: objectId,
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
