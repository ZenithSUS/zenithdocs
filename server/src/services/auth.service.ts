import config from "../config/env.js";
import { IUser } from "../models/User.js";
import {
  createUser,
  getUserByEmail,
  getUserRefreshToken,
  updateUser,
} from "../repositories/user.repository.js";
import AppError from "../utils/app-error.js";
import { comparePassword, hashPassword } from "../utils/bcrypt-password.js";
import jwt from "jsonwebtoken";

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns User if found, null otherwise
 */
export const loginService = async (email: string, password: string) => {
  if (!email || !password)
    throw new AppError("Email and password required", 400);

  // Check if user exists
  const user = await getUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  // Check if password is correct
  const isMatch = await comparePassword(password, user.password!);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // Generate access token and refresh token
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: user.role === "admin" ? "7d" : "1h" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    config.jwt.refreshSecret,
    {
      expiresIn: user.role === "admin" ? "30d" : "7d",
    },
  );

  // Update user refresh token
  await updateUser(user._id.toString(), { refreshToken });

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Register a new user
 * @param data - User data to create
 * @returns Created user
 */
export const registerService = async (data: Partial<IUser>) => {
  if (!data.email || !data.password)
    throw new AppError("Email and password are required", 400);

  // Check if user already exists
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) throw new AppError("User already exists", 400);

  // Encrypt password
  data.password = await hashPassword(data.password);

  const user = await createUser(data);

  // Remove password from response
  user.password = undefined;
  return user;
};

/**
 * Refresh access token using refresh token
 * @param refreshToken - Refresh token from cookie
 * @returns New access token
 */
export const refreshAccessTokenService = async (refreshToken: string) => {
  if (!refreshToken) throw new AppError("No refresh token provided", 401);

  // Verify the refresh token
  let decoded: jwt.JwtPayload;
  try {
    decoded = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret,
    ) as jwt.JwtPayload;
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // Check user exists and token matches what's stored in DB
  const user = await getUserRefreshToken(decoded.userId);

  if (!user) throw new AppError("User not found", 404);
  if (user.refreshToken !== refreshToken)
    throw new AppError("Refresh token mismatch", 401);

  // Issue a new access token
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: user.role === "admin" ? "7d" : "1h" },
  );

  return { accessToken };
};
