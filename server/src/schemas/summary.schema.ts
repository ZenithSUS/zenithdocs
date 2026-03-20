import { z } from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const summaryParamsSchema = z.object({
  summaryId: objectId,
});

export const documentParamsSchema = z.object({
  documentId: objectId,
});

export const createSummarySchema = z.object({
  user: objectId,
  document: objectId,
  type: z.enum(["short", "bullet", "detailed", "executive"]),
});

export const updateSummarySchema = z.object({
  summaryId: objectId,
  data: z
    .object({
      type: z.enum(["short", "bullet", "detailed", "executive"]).optional(),
      content: z.string().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const paginationSchema = z.object({
  page: z.number().min(1, "Page must be a positive integer"),
  limit: z.number().min(1, "Limit must be a positive integer"),
});

export const getSummaryByDocumentPaginatedSchema =
  documentParamsSchema.extend(paginationFields);
export const getSummaryByUserPaginatedSchema = z
  .object({ userId: objectId })
  .extend(paginationFields);
