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
 * Creates a new user if not found, or returns an existing user based on their email.
 * @param {string} email - User email
 * @returns {Promise<IUser>} User if found or created, null otherwise
 */
export const oauthCreateOrGetUser = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) return user;
  return await createUser({ email });
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
  return await User.findById(id).select("-refreshToken -password").lean();
};

/**
 * Get a user by their refresh token
 * @param {string} userId - User ID
 * @returns {Promise<IUser | null>} User if found, null otherwise
 */
export const getUserRefreshToken = async (
  userId: string,
): Promise<IUser | null> => {
  return await User.findOne({ _id: userId }).select("-password").lean();
};

/**
 * Get user by email
 * @param email - User email
 * @returns User if found, null otherwise
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email: email.toLowerCase() })
    .select("-refreshToken")
    .lean();
};

/**
 * Search for users by their email address.
 * This function is case-insensitive.
 * It will return up to 5 users that match the search query.
 * The refresh token and password of each user will be excluded from the result.
 * @param {string} searchQuery - The search query to search for users by their email address.
 * @returns {Promise<Array<IUser>>} An array of users that match the search query.
 */
export const searchUsersByEmail = async (searchQuery: string) => {
  return await User.find({ email: { $regex: searchQuery, $options: "i" } })
    .select("-refreshToken -password")
    .limit(5)
    .lean();
};

/**
 * Get all users
 * @returns Array of users
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find()
    .select("-refreshToken -tokenVersion -password")
    .lean();
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

  return await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  })
    .select("-refreshToken -tokenVersion -password")
    .lean();
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
  return await User.findByIdAndDelete(id)
    .select("-refreshToken -tokenVersion -password")
    .lean();
};

/**
 * Revoke all tokens for a user by incrementing their token version and removing their refresh token.
 * @param {string} id - User ID
 * @returns {Promise<IUser | null>} Revoked user if found, null otherwise
 */
export const revokeUserTokens = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const user = await User.findByIdAndUpdate(
    id,
    {
      $inc: { tokenVersion: 1 },
      $set: { refreshToken: null },
    },
    { returnDocument: "after" },
  );
  return user;
};
