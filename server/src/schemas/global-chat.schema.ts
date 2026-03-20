import { z } from "zod";
import { objectId } from "../utils/zod.utils.js";

export const globalChatParamsSchema = z.object({
  userId: objectId,
});

export const globalChatAuthSchema = z.object({
  userId: objectId,
  currentUserId: objectId,
});
