import z from "zod";
import { objectId, yearMonth } from "../utils/zod.utils.js";

export const getDashboardOverviewSchema = z.object({
  userId: objectId,
  month: yearMonth,
});
