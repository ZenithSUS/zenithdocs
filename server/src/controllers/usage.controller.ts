import { NextFunction, Request, Response } from "express";
import { IUsage } from "../models/Usage.js";
import {
  createUsageService,
  deleteUsageById,
  deleteUsageByUserService,
  getAllUsageServiceAdmin,
  getUsageByUserAndMonthService,
  getUsageByUserService,
  updateUsageService,
} from "../services/usage.service.js";
import { ParamsDictionary } from "express-serve-static-core";
import AppError from "../utils/app-error.js";

interface UsageParams extends ParamsDictionary {
  id: string;
  userId: string;
  month: string;
}

/**
 * Creates a new usage document with the given data
 * @route POST /api/usage
 */
export const createUsageController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: Partial<IUsage> = req.body;

    const usage = await createUsageService(data);

    return res.status(201).json({
      success: true,
      message: "Usage created successfully",
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Retrieves a usage document by user ID and month
 * @route GET /api/usage/user/:id/:month
 */
export const getUsageByUserAndMonthController = async (
  req: Request<UsageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, month } = req.params;
    const usage = await getUsageByUserAndMonthService(id, month);

    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Retrieves a usage document by user ID
 * @route GET /api/usage/:id
 */
export const getUsageByUserController = async (
  req: Request<UsageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const usage = await getUsageByUserService(id);

    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Retrieves all usage documents from the database (populated with user email) - Admin Only
 * @route GET /api/usage
 */
export const getAllUsageAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usage = await getAllUsageServiceAdmin();
    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Updates a usage document by ID
 * @route PUT /api/usage/:id
 */
export const updateUsageController = async (
  req: Request<UsageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }
    const data: Partial<IUsage> = {
      ...req.body,
      user: currentUserId,
    };

    const usage = await updateUsageService(id, data, currentUserId, role);

    return res.status(201).json({
      success: true,
      message: "Usage updated successfully",
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Deletes a usage document by ID
 * @route DELETE /api/usage/:id
 */
export const deleteUsageController = async (
  req: Request<UsageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const usage = await deleteUsageById(id, currentUserId, role);

    return res.status(201).json({
      success: true,
      message: "Usage deleted successfully",
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};

/** Deletes all usage documents belonging to a user
 * @route DELETE /api/usage/user/:id
 */
export const deleteUsageByUserController = async (
  req: Request<UsageParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && currentUserId !== id)) {
      throw new AppError("Unauthorized", 401);
    }

    const usage = await deleteUsageByUserService(id, currentUserId, role);

    return res.status(201).json({
      success: true,
      message: "Usage deleted successfully",
      data: usage,
    });
  } catch (error) {
    next(error);
  }
};
