import { Request, Response } from "express";

import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  updateUserService,
} from "../services/user.service";

interface UserParams {
  id: string;
}

/**
 * Create a new user
 * POST /api/users
 */
export const createUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, role, tokensUsed } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const user = await createUserService({
      email,
      password,
      role: role || "user",
      tokensUsed: tokensUsed || 0,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message,
    });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserByIdController = async (
  req: Request<UserParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message,
    });
  }
};

/**
 * Get all users
 * GET /api/users
 */
export const getAllUsersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUserController = async (
  req: Request<UserParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, password, role, tokensUsed, refreshToken } = req.body;

    if (!id && typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    // Check if user exists
    const existingUser = await getUserByIdService(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await getUserByEmailService(email);
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "Email already in use",
        });
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (role) updateData.role = role;
    if (tokensUsed !== undefined) updateData.tokensUsed = tokensUsed;
    if (refreshToken !== undefined) updateData.refreshToken = refreshToken;

    const updatedUser = await updateUserService(id, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message,
    });
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUserController = async (
  req: Request<UserParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await getUserByIdService(id);
    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await deleteUserService(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message,
    });
  }
};
