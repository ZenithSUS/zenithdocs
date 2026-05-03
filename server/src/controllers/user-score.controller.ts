import { NextFunction, Request, Response } from "express";
import { IUserScoreInput } from "../models/user-score.model.js";
import {
  createUserScoreService,
  deleteUserScoreService,
  getUserScoreByIdService,
  getUserScoreByUserAndLearningSetIdService,
  updateUserScoreService,
} from "../services/user-score.service.js";
import { ParamsDictionary } from "express-serve-static-core";

interface UserScoreParams extends ParamsDictionary {
  id: string;
  userId: string;
  learningSetId: string;
}

/**
 * Create a new user score.
 * @route POST /api/user-scores
 */
export const createUserScoreController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: IUserScoreInput = req.body;

    const userScore = await createUserScoreService(data);

    return res.status(201).json({
      success: true,
      message: "User score created successfully",
      data: userScore,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a user score by ID.
 * @route GET /api/user-scores/:id
 */
export const getUserScoreByIdController = async (
  req: Request<Pick<UserScoreParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const userScore = await getUserScoreByIdService(id);

    return res.status(200).json({
      success: true,
      message: "User score fetched successfully",
      data: userScore,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a user score by user ID and learning set ID.
 * @route GET /api/user-scores/user/:userId/learning-set/:learningSetId
 */
export const getUserScoreByUserAndLearningSetIdController = async (
  req: Request<Pick<UserScoreParams, "userId" | "learningSetId">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.user.sub;
    const role = req.user.role;
    const { userId, learningSetId } = req.params;

    const userScore = await getUserScoreByUserAndLearningSetIdService(
      userId,
      learningSetId,
      currentUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "User score fetched successfully",
      data: userScore,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a user score by ID.
 * @route PUT /api/user-scores/:id
 */
export const updateUserScoreController = async (
  req: Request<Pick<UserScoreParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data: Partial<IUserScoreInput> = req.body;
    const currentUserId = req.user.sub;
    const role = req.user.role;

    const userScore = await updateUserScoreService(
      id,
      data,
      currentUserId,
      role,
    );

    return res.status(200).json({
      success: true,
      message: "User score updated successfully",
      data: userScore,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a user score by ID.
 * @route DELETE /api/user-scores/:id
 */
export const deleteUserScoreController = async (
  req: Request<Pick<UserScoreParams, "id">>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.sub;
    const role = req.user.role;

    const userScore = await deleteUserScoreService(id, currentUserId, role);

    return res.status(200).json({
      success: true,
      message: "User score deleted successfully",
      data: userScore,
    });
  } catch (error) {
    next(error);
  }
};
