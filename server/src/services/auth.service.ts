import { Request } from "express";
import config from "../config/env.js";
import { IUser } from "../models/user.model.js";
import {
  createRefreshToken,
  deleteTokenById,
  deleteTokenByUserAndToken,
  deleteTokensByUserId,
  getRefreshToken,
} from "../repositories/refresh-token.repository.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../repositories/user.repository.js";
import { authSchema, authUserIdSchema } from "../schemas/auth.schema.js";
import AppError from "../utils/app-error.js";
import { comparePassword, hashPassword } from "../utils/bcrypt-password.js";
import jwt from "jsonwebtoken";
import hashToken from "../utils/hash-token.js";
import { extractRequestMeta } from "../utils/extract-request-meta.js";

/**
 * Login user
 * @param email - User email
 * @param password - User password
 * @returns User if found, null otherwise
 */
export const loginService = async (
  email: string,
  password: string,
  req: Request,
) => {
  const validated = authSchema.parse({ email, password });

  // Check if user exists
  const user = await getUserByEmail(validated.email);
  if (!user) throw new AppError("User not found", 404);

  if (!user.password) {
    throw new AppError("Invalid credentials", 401);
  }

  // Check if password is correct
  const isMatch = await comparePassword(validated.password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  // Generate access token and refresh token
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: user.role === "admin" ? "7d" : "1h" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    config.jwt.refreshSecret,
    {
      expiresIn: user.role === "admin" ? "30d" : "7d",
    },
  );

  const { ip, device } = extractRequestMeta(req);

  const expirationData =
    user.role === "admin"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days,

  // Create user refresh token
  await createRefreshToken({
    userId: user._id,
    token: hashToken(refreshToken),
    device: device,
    ip: ip,
    expiresAt: expirationData,
  });

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Log in a user using OAuth.
 * @param user - User object
 * @returns - Object containing access token and refresh token
 * @throws AppError - If user not found
 */
export const oauthLoginService = async (user: IUser, req: Request) => {
  if (!user) throw new AppError("User not found", 404);

  // Generate access token and refresh token
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: user.role === "admin" ? "7d" : "1h" },
  );

  const refreshToken = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    config.jwt.refreshSecret,
    {
      expiresIn: user.role === "admin" ? "30d" : "7d",
    },
  );

  const { ip, device } = extractRequestMeta(req);

  const expirationData =
    user.role === "admin"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days,

  // Create user refresh token
  await createRefreshToken({
    userId: user._id,
    token: hashToken(refreshToken),
    device: device,
    ip: ip,
    expiresAt: expirationData,
  });

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
  const validated = authSchema.parse(data);

  // Check if user already exists
  const existingUser = await getUserByEmail(validated.email);
  if (existingUser) throw new AppError("User already exists", 400);

  // Encrypt password
  validated.password = await hashPassword(validated.password);

  const user = await createUser(validated);

  // Remove password from response
  user.password = undefined;
  return user;
};

/**
 * Logs out a user by removing their refresh token
 * @param {string} userId - User ID to log out
 * @returns {Promise<void>} Promise that resolves when the user is logged out
 */
export const logoutService = async (userId: string, refreshToken: string) => {
  if (!userId) throw new AppError("User ID is required", 400);

  const validated = authUserIdSchema.parse({ userId });

  if (!refreshToken) throw new AppError("No refresh token provided", 400);

  const hashed = hashToken(refreshToken);

  await deleteTokenByUserAndToken(validated.userId, hashed);
};

/**
 * Refresh access token using refresh token
 * @param refreshToken - Refresh token from cookie
 * @returns New access token
 */
export const refreshAccessTokenService = async (
  refreshToken: string,
  req: Request,
) => {
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
  const storedToken = await getRefreshToken(hashToken(refreshToken));

  if (!storedToken) {
    await deleteTokensByUserId(decoded.userId.toString());

    throw new AppError(
      "Suspicious activity detected. Please login again.",
      401,
    );
  }

  const user = await getUserById(decoded.userId.toString());

  if (!user) throw new AppError("User not found", 404);

  if (user.tokenVersion !== decoded.tokenVersion)
    throw new AppError("Token version mismatch", 401);

  if (storedToken.expiresAt < new Date())
    throw new AppError("Refresh token expired", 401);

  // Delete old refresh token

  await deleteTokenById(storedToken._id.toString());

  // Issue a new refresh token
  const newRefreshToken = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    config.jwt.refreshSecret,
    {
      expiresIn: user.role === "admin" ? "30d" : "7d",
    },
  );

  const { ip, device } = extractRequestMeta(req);

  const expirationData =
    user.role === "admin"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days,

  // Create user refresh token
  await createRefreshToken({
    userId: user._id,
    token: hashToken(newRefreshToken),
    device: device,
    ip: ip,
    expiresAt: expirationData,
  });

  // Issue a new access token
  const accessToken = jwt.sign(
    { sub: user._id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: user.role === "admin" ? "7d" : "1h" },
  );

  return { accessToken, refreshToken: newRefreshToken };
};
