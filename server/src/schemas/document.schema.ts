import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const documentParamsSchema = z.object({
  docId: objectId,
});

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required."),
  fileUrl: z.string().min(1, "File URL is required."),
  fileType: z.string().min(1, "File type is required."),
  fileSize: z.number().min(1, "File size is required."),
  user: objectId,
  folder: objectId.optional(),
  rawText: z.string().min(1, "Raw text is required."),
  publicId: z.string().min(1, "Public ID is required."),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export const getDocumentsByUserPageSchema = z.object({
  userId: objectId,
  ...paginationFields,
});
