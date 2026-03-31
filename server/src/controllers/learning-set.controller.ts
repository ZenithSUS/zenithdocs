import { NextFunction, Request, Response } from "express";
import { ILearningSetInput } from "../models/LearningSet.js";
import {
  createLearningSetService,
  deleteLearningSetByIdService,
  getLearningSetByIdService,
  getLearningSetsByUserPaginatedService,
  updateLearningSetByIdService,
} from "../services/learning-set.service.js";
import { ParamsDictionary } from "express-serve-static-core";
import AppError from "../utils/app-error.js";
import { generateLearningSets } from "../lib/mistral/services/document-learning-set.service.js";
import { createLearningSetRequestSchema } from "../schemas/learning-set.schema.js";

interface LearningSetParams extends ParamsDictionary {
  id: string;
}

/**
 * Create a new learning set
 * @route POST /learning-sets
 */
export const createLearningSetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const role = req.user.role;
    const validated = createLearningSetRequestSchema.parse({
      ...req.body,
      ownerId: currentUserId,
      role,
    });

    // Generate learning set from chunks
    const generatedLearningSet = await generateLearningSets(validated);

    const learningSet = await createLearningSetService({
      ...generatedLearningSet,
      title: validated.title,
    });

    return res.status(200).json({
      success: true,
      message: "Learning set created successfully",
      data: learningSet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get learning set by id
 * @route GET /learning-sets/:id
 */
export const getLearningSetByIdController = async (
  req: Request<LearningSetParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const role = req.user.role;
    const { id } = req.params;

    const learningSet = await getLearningSetByIdService(
      id,
      currentUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "Learning set fetched successfully",
      data: learningSet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get learning sets by user id
 * @route GET /learning-sets/user/:id
 * @route GET /learning-sets/user/:id?page=1&limit=10
 */
export const getLearningSetsByUserPaginated = async (
  req: Request<LearningSetParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const userId = req.params.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (userId !== currentUserId) {
      throw new AppError("Forbidden", 403);
    }

    const learningSets = await getLearningSetsByUserPaginatedService(
      userId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Learning sets fetched successfully",
      data: learningSets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update learning set by id
 * @route PUT /learning-sets/:id
 */
export const updateLearningSetController = async (
  req: Request<LearningSetParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const role = req.user.role;

    const { id } = req.params;
    const data: Partial<ILearningSetInput> = req.body;

    const learningSet = await updateLearningSetByIdService(
      id,
      data,
      currentUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "Learning set updated successfully",
      data: learningSet,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete learning set by id
 * @route DELETE /learning-sets/:id
 */
export const deleteLearningSetController = async (
  req: Request<LearningSetParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const role = req.user.role;

    const { id } = req.params;

    const learningSet = await deleteLearningSetByIdService(
      id,
      currentUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "Learning set deleted successfully",
      data: learningSet,
    });
  } catch (error) {
    next(error);
  }
};
