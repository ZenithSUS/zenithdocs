import { IUser } from "../models/User.js";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";

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
  const user = await updateUser(id, data);
  return user;
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Deleted user if found, null otherwise
 */
export const deleteUserService = async (id: string) => {
  const user = await deleteUser(id);
  return user;
};
