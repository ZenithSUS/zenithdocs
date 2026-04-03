import { IUser } from "../models/user.model.js";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  searchUsersByEmail,
  updateUser,
} from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";
import { hashPassword } from "../utils/bcrypt-password.js";
import PLAN_LIMITS from "../config/plans.js";
import { updateUsageMonthByUser } from "../repositories/usage.repository.js";
import {
  getUserByEmailSchema,
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
    tokenLimit: PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].tokenLimit,
    documentLimit:
      PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].documentLimit,
  };

  // Update usage
  await updateUsageMonthByUser(user._id.toString(), month);

  const userWithTokenLimit = { ...user, ...userLimits };

  return userWithTokenLimit;
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
  const validated = getUserByEmailSchema.parse({ email });

  const user = await getUserByEmail(validated.email);
  return user;
};

/**
 * Search for users by their email address.
 * This function is case-insensitive.
 * It will return up to 5 users that match the search query.
 * The refresh token and password of each user will be excluded from the result.
 * @param {string} searchQuery - The search query to search for users by their email address.
 * @returns {Promise<Array<IUser>>} An array of users that match the search query.
 */
export const searchUsersByEmailService = async (searchQuery: string) => {
  const validated = searchUsersByEmailSchema.parse({ searchQuery });

  const users = await searchUsersByEmail(validated.searchQuery);
  return users;
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
