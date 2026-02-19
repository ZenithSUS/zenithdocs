import { Request, Response } from "express";
import {
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service.js";
import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { IUser } from "../models/User.js";
import AppError from "../utils/app-error.js";

interface UserParams extends ParamsDictionary {
  id: string;
}

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
export const getUserByIdController = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 * @route GET /api/users
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
export const updateUserController = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data: Partial<IUser> = req.body;

    // Check if user exists
    const existingUser = await getUserByIdService(id);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await getUserByEmailService(data.email);
      if (emailExists) {
        throw new AppError("Email already in use", 400);
      }
    }

    const updatedUser = await updateUserService(id, data);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
export const deleteUserController = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await getUserByIdService(id);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    await deleteUserService(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
