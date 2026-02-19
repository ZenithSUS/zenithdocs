import { Request, Response } from "express";
import {
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service.js";

import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { hashPassword } from "../utils/bcrypt-password.js";

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
    const { email, password, role, tokensUsed, refreshToken } = req.body;

    // Check if user exists
    const existingUser = await getUserByIdService(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await getUserByEmailService(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    const updateData: Record<string, unknown> = {};

    // Update user data
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
    }
    if (role) updateData.role = role;
    if (tokensUsed !== undefined) updateData.tokensUsed = tokensUsed;
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken;

    const updatedUser = await updateUserService(id, updateData);

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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
