import User, { IUser } from "../models/User.js";
import mongoose from "mongoose";

/**
 * Create a new user
 * @param data - User data to create
 * @returns Created user
 */
export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns User if found, null otherwise
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return await User.findById(id);
};

/**
 * Get user by email
 * @param email - User email
 * @returns User if found, null otherwise
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email: email.toLowerCase() });
};

/**
 * Get all users
 * @returns Array of users
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select("-refreshToken");
};

/**
 * Update user by ID
 * @param id - User ID
 * @param data - Data to update
 * @returns Updated user if found, null otherwise
 */
export const updateUser = async (
  id: string,
  data: Partial<IUser>,
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return await User.findByIdAndUpdate(id, data, { new: true }).select(
    "-refreshToken",
  );
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Deleted user if found, null otherwise
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return await User.findByIdAndDelete(id);
};
