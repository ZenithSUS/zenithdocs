import { IUsage } from "../models/Usage.js";
import {
  createUsage,
  getAllUsageAdmin,
  getUsageByUser,
  getUsageByUserAndMonth,
  updateUsage,
  deleteUsageByUser,
  deleteUsage,
  getUsageById,
} from "../repositories/usage.repository.js";
import AppError from "../utils/app-error.js";

/**
 * Creates a new usage document with the given data.
 * If a usage document for the given user and month already exists, it will be returned instead.
 * @param {Partial<IUsage>} data - Usage data to create
 * @returns {Promise<IUsage>} Created usage document if found, null otherwise
 * @throws {AppError} If usage data is invalid or if user or month is missing
 */
export const createUsageService = async (data: Partial<IUsage>) => {
  if (!data || Object.keys(data).length === 0)
    throw new AppError("Usage data is required", 400);

  if (!data.user || !data.month)
    throw new AppError("User and month are required", 400);

  const existingUsage = await getUsageByUserAndMonth(
    data.user.toString(),
    data.month,
  );

  // If usage document already exists, return it instead of creating a new one
  if (existingUsage) return existingUsage;

  const usage = await createUsage(data);
  return usage;
};

/**
 * Retrieves all usage documents from the database (populated with user email) - Admin Only
 * @returns {Promise<IUsage[]>} Array of all usage documents
 * @throws {AppError} If usage data is invalid
 */
export const getAllUsageServiceAdmin = async () => {
  const usage = await getAllUsageAdmin();
  return usage;
};

/**
 * Retrieves a usage document by user ID and month
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage | null>} Usage document if found, null otherwise
 * @throws {AppError} If user ID or month is invalid or missing
 */
export const getUsageByUserAndMonthService = async (
  userId: string,
  month: string,
) => {
  if (!userId || !month)
    throw new AppError("User ID and month are required", 400);

  const usage = await getUsageByUserAndMonth(userId, month);
  return usage;
};

/**
 * Retrieves all usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<IUsage[]>} Array of usage documents if found, empty array otherwise
 * @throws {AppError} If user ID is invalid or missing
 */
export const getUsageByUserService = async (userId: string) => {
  if (!userId) throw new AppError("User ID is required", 400);

  const usage = await getUsageByUser(userId);
  return usage;
};

/** Updates a usage document by ID
 * @param {string} id - Usage ID
 * @param {Partial<IUsage>} data - Usage data to update
 * @param {string} currentUserId - ID of the user making the request (for authorization)
 * @param {"user" | "admin"} role - Role of the user making the request (for authorization)
 * @returns {Promise<IUsage>} Updated usage document if found, null otherwise
 * @throws {AppError} If usage data is invalid or if user or month is missing
 */
export const updateUsageService = async (
  id: string,
  data: Partial<IUsage>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  if (!id) throw new AppError("Usage ID is required", 400);
  if (!data || Object.keys(data).length === 0)
    throw new AppError("Usage data is required", 400);

  const existingUsage = await getUsageById(id);
  
  if (!existingUsage) {
    throw new AppError(
      "Usage document not found for the given user and month",
      404,
    );
  }

  if (existingUsage.user.toString() !== currentUserId && role !== "admin") {
    throw new AppError(
      "You are not authorized to update this usage document",
      403,
    );
  }

  const usage = await updateUsage(id, data);
  return usage;
};

/** * Deletes all usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<DeleteResult>} Result of delete operation
 * @throws {AppError} If user ID is invalid or missing
 */
export const deleteUsageByUserService = async (userId: string) => {
  if (!userId) throw new AppError("User ID is required", 400);

  const usage = await deleteUsageByUser(userId);
  return usage;
};

/** Deletes a usage document by ID
 * @param {string} id - Usage ID
 * @param {string} currentUserId - ID of the user making the request (for authorization)
 * @param {"user" | "admin"} role - Role of the user making the request (for authorization)
 * @returns {Promise<DeleteResult>} Result of delete operation
 * @throws {AppError} If usage ID is invalid or missing
 */
export const deleteUsageById = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  if (!id) throw new AppError("Usage ID is required", 400);

  const existingUsage = await getUsageById(id);

  if (!existingUsage) {
    throw new AppError("Usage document not found", 404);
  }

  if (existingUsage.user._id.toString() !== currentUserId && role !== "admin") {
    throw new AppError(
      "You are not authorized to delete this usage document",
      403,
    );
  }

  const usage = await deleteUsage(id);

  return usage;
};
