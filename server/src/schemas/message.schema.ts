import z from "zod";
import { objectId, paginationFields } from "../utils/zod.utils.js";

export const getMessagesByChatPageSchema = z.object({
  chatId: objectId,
  ...paginationFields,
});

export const deleteMessagesByChatAndUserSchema = z.object({
  chatId: objectId,
  userId: objectId,
});
