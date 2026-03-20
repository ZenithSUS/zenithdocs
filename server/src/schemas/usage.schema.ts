import { z } from "zod";
import { objectId, yearMonth } from "../utils/zod.utils.js";

export const usageParamsSchema = z.object({
  usageId: objectId,
});

export const createUsageSchema = z.object({
  user: objectId,
  month: yearMonth,
});

export const getUsageByUserAndMonthSchema = z.object({
  userId: objectId,
  month: yearMonth,
});

export const getLastSixMonthsUsageByUserSchema = z.object({
  userId: objectId,
});

export const deleteUsageByUserSchema = z.object({
  userId: objectId,
});

export const updateUsageSchema = createUsageSchema.partial();

export const updateUsageByUserAndMonthSchema = z.object({
  userId: objectId,
  tokensUsed: z.number().min(0, "Tokens used cannot be negative."),
});
