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

export const getChatByUserSchema = z.object({
  userId: objectId,
});

export const getChatByUserPageSchema = z.object({
  userId: objectId,
  ...paginationFields,
});
