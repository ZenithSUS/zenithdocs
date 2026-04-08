import { IUser } from "../models/user.model.js";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  matchUserByEmail,
  updateUser,
} from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";
import { hashPassword } from "../utils/bcrypt-password.js";
import PLAN_LIMITS from "../config/plans.js";
import { updateUsageMonthByUser } from "../repositories/usage.repository.js";
import {
  userEmailSchema,
  searchUsersByEmailSchema,
  updateUserSchema,
  userParamsSchema,
} from "../schemas/user.schema.js";

/**
 * Get user by ID
 * @param id - User ID
 * @returns User if found, null otherwise
 * @throws {Error} error if not full
 *
 */
export const getUserByIdService = async (id: string) => {
  const month = new Date().toISOString().slice(0, 7);

  const { userId: validatedId } = userParamsSchema.parse({ userId: id });

  const user = await getUserById(validatedId);

  if (!user) throw new AppError("User not found", 404);

  // Add tokenLimit and documentLimit to user
  const userLimits = {
    documentLimit:
      PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].documentLimit,
    storageLimit:
      PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].storageLimitMB,
    messagesPerDay:
      PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].messagesPerDay,
  };

  // Update usage
  await updateUsageMonthByUser(user._id.toString(), month);

  const userWithTokenLimit = { ...user, ...userLimits };

  return userWithTokenLimit;
};

/**
 * Get all users
 * @param {string} role - User role
 * @returns Array of users
 */
export const getAllUsersService = async (role: "user" | "admin") => {
  if (role !== "admin") throw new AppError("Forbidden", 403);

  const users = await getAllUsers();
  return users;
};

/**
 * Get user by email
 * @param email - User email
 * @returns User if found, null otherwise
 */
export const getUserByEmailService = async (email: string) => {
  const validated = userEmailSchema.parse({ email });

  const user = await getUserByEmail(validated.email);
  return user;
};

/**
 * Finds a user by their email
 * @param {string} email - User email
 * @returns {Promise<IUser | null>} User if found, null otherwise
 * @throws {AppError} If email is invalid
 */
export const matchUserByEmailService = async (email: string) => {
  const validated = userEmailSchema.parse({ email });

  const user = await matchUserByEmail(validated.email);

  if (!user) throw new AppError("User not found", 404);

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
  const validated = updateUserSchema.parse({ userId: id, data });

  // If password is being updated, hash it
  if (validated.data.password) {
    validated.data.password = await hashPassword(validated.data.password);
  }

  const user = await updateUser(validated.userId, validated.data);

  if (!user) throw new AppError("User not found", 404);
  return user;
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Deleted user if found, null otherwise
 */
export const deleteUserService = async (id: string) => {
  const { userId: validatedId } = userParamsSchema.parse({ userId: id });

  const user = await deleteUser(validatedId);

  if (!user) throw new AppError("User not found", 404);
  return user;
};
