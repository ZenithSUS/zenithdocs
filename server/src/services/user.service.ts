import { IUser } from "../models/User";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../repositories/user.repository";
import { hashPassword } from "../utils/bcrypt-password";

/**
 * Create a new user
 * @param data - User data to create
 * @returns Created user
 */
export const createUserService = async (data: Partial<IUser>) => {
  // Encrypt password if provided
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const user = await createUser(data);
  return user;
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns User if found, null otherwise
 *
 */
export const getUserByIdService = async (id: string) => {
  const user = await getUserById(id);
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
 * @param data - Data to update
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
