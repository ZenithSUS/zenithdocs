import mongoose from "mongoose";
import { IUser } from "../models/User.js";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";
import { hashPassword } from "../utils/bcrypt-password.js";

/**
 * Get user by ID
 * @param id - User ID
 * @returns User if found, null otherwise
 * @throws {Error} error if not full
 *
 */
export const getUserByIdService = async (id: string) => {
  if (!id) throw new AppError("User ID is required", 400);

  const user = await getUserById(id);

  if (!user) throw new AppError("User not found", 404);

  return user;
};

/**
 * Get all users
 * @returns Array of users
 */
export const getAllUsersService = async () => {
  const users = await getAllUsers();
  return users;
};

/**
 * Get user by email
 * @param email - User email
 * @returns User if found, null otherwise
 */
export const getUserByEmailService = async (email: string) => {
  if (!email) throw new AppError("Email is required", 400);

  const user = await getUserByEmail(email);
  return user;
};

/**
 * Update user by ID
 * @param id - User ID
 * @param {Partial<IUser>} data - Data to update
 * @returns Updated user if found, null otherwise
 *
 */
export const updateUserService = async (id: string, data: Partial<IUser>) => {
  if (!id) throw new AppError("User ID is required", 400);

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid User ID", 400);

  if (!data || Object.keys(data).length === 0)
    throw new AppError("Data is required", 400);

  // If password is being updated, hash it
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const user = await updateUser(id, data);

  if (!user) throw new AppError("User not found", 404);
  return user;
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Deleted user if found, null otherwise
 */
export const deleteUserService = async (id: string) => {
  if (!id) throw new AppError("User ID is required", 400);

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid User ID", 400);

  const user = await deleteUser(id);

  if (!user) throw new AppError("User not found", 404);
  return user;
};
