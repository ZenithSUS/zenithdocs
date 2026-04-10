import { Request, Response, NextFunction } from "express";
import { ISummary } from "../models/summary.model.js";
import {
  createSummaryService,
  deleteSummaryService,
  getAllSummaryService,
  getSummarByDocumentyPaginatedService,
  getSummaryByIdService,
  getSummaryByUserPaginatedService,
  updateSummaryService,
} from "../services/summary.service.js";
import { ParamsDictionary } from "express-serve-static-core";
import AppError from "../utils/app-error.js";

interface SummaryParams extends ParamsDictionary {
  id: string;
}

/**
 * Creates a new summary
 * @route POST /api/summaries
 */
export const createSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user?.sub;
    const role = req.user?.role;

    if (!currentUserId || (role !== "admin" && role !== "user")) {
      throw new AppError("Unauthorized", 401);
    }

    const data: Partial<ISummary> = {
      ...req.body,
      user: currentUserId,
    };

    const summary = await createSummaryService(data);

    return res.status(201).json({
      success: true,
      message: "Summary created successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all summaries (admin only)
 * @route GET /api/summaries
 */
export const getAllSummaryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.user.role;
    const summaries = await getAllSummaryService(role);

    return res.status(200).json({
      success: true,
      message: "Summaries fetched successfully",
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get summary by id
 * @route GET /api/summaries/:id
 */
export const getSummaryByIdController = async (
  req: Request<SummaryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const summary = await getSummaryByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get summary by document
 * @route GET /api/summaries/document/:id
 */
export const getSummaryByDocumentPaginatedController = async (
  req: Request<SummaryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const summaries = await getSummarByDocumentyPaginatedService(
      id,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Summaries fetched successully",
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get summary by user
 * @route GET /api/summaries/user/:id
 */
export const getSummaryByUserPaginatedController = async (
  req: Request<SummaryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const summaries = await getSummaryByUserPaginatedService(id, page, limit);

    return res.status(200).json({
      success: true,
      message: "Summaries fetched successfully",
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a summary
 * @route PUT /api/summaries/:id
 */
export const updateSummaryController = async (
  req: Request<SummaryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data: Partial<ISummary> = req.body;

    const summary = await updateSummaryService(id, data);

    return res.json({
      success: true,
      message: "Summary Updated Successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a summary
 * @route DELETE /api/summaries/:id
 */
export const deleteSummaryController = async (
  req: Request<SummaryParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const summary = await deleteSummaryService(id);

    return res.status(200).json({
      success: true,
      message: "Summary deleted successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
