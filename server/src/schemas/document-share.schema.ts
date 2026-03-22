import { z } from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const createDocumentShareSchema = z.object({
  documentId: objectId,
  ownerId: objectId,
  type: z.enum(["public", "private"]),
  allowedUsers: z
    .array(
      z.object({
        userId: objectId,
        permission: z.enum(["read", "write"]),
      }),
    )
    .optional(),
  publicPermission: z.enum(["read", "write"]).optional(),
  allowDownload: z.boolean().optional(),
  allowEdit: z.boolean().optional(),
  expiresAt: z.date().optional(),
});

export const getDocumentShareByTokenSchema = z.object({
  token: z.string().min(1, { message: "Invalid token" }),
});

export const getDocumentShareByIdSchema = z.object({ id: objectId });

export const getDocumentSharesByUserPage = z.object({
  userId: objectId,
  ...paginationFields,
});

export const updateDocumentShareSchema = createDocumentShareSchema
  .partial()
  .extend({
    id: objectId,
    ownerId: objectId,
  });

export const deleteDocumentShareSchema = z.object({
  id: objectId,
  ownerId: objectId,
});
