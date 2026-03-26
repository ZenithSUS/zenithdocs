import { z } from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

const createDocumentShareBaseSchema = z.object({
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

export const createDocumentShareSchema =
  createDocumentShareBaseSchema.superRefine((data, ctx) => {
    if (data.type === "private") {
      if (!data.allowedUsers || data.allowedUsers.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Private share must have at least one user",
          path: ["allowedUsers"],
        });
      }
      if (data.publicPermission) {
        ctx.addIssue({
          code: "custom",
          message: "Private shares cannot have publicPermission",
          path: ["publicPermission"],
        });
      }
    }

    if (data.type === "public") {
      if (data.allowedUsers && data.allowedUsers.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Public shares should not have allowed users",
          path: ["allowedUsers"],
        });
      }
    }

    if (data.expiresAt && data.expiresAt < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Expiry date must be in the future",
        path: ["expiresAt"],
      });
    }
  });

export const getDocumentShareByTokenSchema = z.object({
  token: z.string().min(1, { message: "Invalid token" }),
});

export const getDocumentShareByIdSchema = z.object({
  id: objectId,
  ownerId: objectId,
});

export const getDocumentSharesByUserPage = z.object({
  userId: objectId,
  ...paginationFields,
});

export const updateDocumentShareSchema = createDocumentShareBaseSchema
  .partial()
  .extend({
    id: objectId,
    ownerId: objectId,
  });

export const deleteDocumentShareSchema = z.object({
  id: objectId,
  ownerId: objectId,
});
