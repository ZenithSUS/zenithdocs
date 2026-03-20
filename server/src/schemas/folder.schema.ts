import z from "zod";
import { objectId } from "../utils/zod.utils.js";

export const folderParamsSchema = z.object({
  folderId: objectId,
});

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required."),
  user: objectId,
});

export const getFolderByNameSchema = z.object({
  name: z.string().min(1, "Folder name is required."),
});

export const getFolderByUserSchema = z.object({
  userId: objectId,
});

export const getFolderByUserPageSchema = z.object({
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

export const updateFolderSchema = createFolderSchema.partial();
