import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const initChatDocumentSchema = z.object({
  documentId: objectId,
  userId: objectId,
});

export const getChatByDocumentSchema = z.object({
  documentId: objectId,
  userId: objectId,
});

export const streamDocumentChatSchema = z.object({
  question: z.string().min(1, "Question is required."),
  documentId: objectId,
});

export const streamPublicDocumentChatSchema = z.object({
  question: z.string().min(1, "Question is required."),
  shareToken: z.string().min(1, "Share token is required."),
});

export const getChatByUserSchema = z.object({
  userId: objectId,
});

export const getChatByUserPageSchema = z.object({
  userId: objectId,
  ...paginationFields,
});
