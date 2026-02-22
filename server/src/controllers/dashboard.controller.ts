import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { getDashboardOverviewService } from "../services/dashboard.service.js";

interface DashboardParams extends ParamsDictionary {
  id: string;
}

/**
 * Get dashboard overview by user ID
 * @route GET /api/dashboard/:id
 */
export const getDashboardOverviewController = async (
  req: Request<DashboardParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const dashboard = await getDashboardOverviewService(id);

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
