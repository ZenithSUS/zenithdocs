import { NextFunction } from "connect";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { getUsageByUserAndMonth } from "../repositories/usage.repository.js";
import PLAN_LIMITS from "../config/plans.js";
import AppError from "../utils/app-error.js";

const checkMessageLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.sub;
  const plan = req.user.plan;

  const today = dayjs().format("YYYY-MM-DD");
  const month = dayjs().format("YYYY-MM");

  const usage = await getUsageByUserAndMonth(userId, month);
  const todayCount = usage?.dailyMessages[today] ?? 0;

  if (
    todayCount >= PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS].messagesPerDay
  ) {
    return next(new AppError("Message limit exceeded for today", 400));
  }

  next();
};

export default checkMessageLimit;
