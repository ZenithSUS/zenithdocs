import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

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
  ...paginationFields,
});

export const updateFolderSchema = createFolderSchema.partial();
