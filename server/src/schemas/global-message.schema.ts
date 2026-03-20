import { z } from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const getGlobalMessagesPaginatedSchema = z.object({
  chatId: objectId,
  ...paginationFields,
});

export const deleteGlobalMessagesSchema = z.object({
  chatId: objectId,
  userId: objectId,
});
