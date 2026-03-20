import { IUsageInput } from "../models/Usage.js";
import {
  createUsage,
  getAllUsageAdmin,
  getUsageByUser,
  getUsageByUserAndMonth,
  updateUsage,
  deleteUsageByUser,
  deleteUsage,
  getUsageById,
  incrementOnlyTokensUsed,
  getLastSixMonthsUsageByUser,
} from "../repositories/usage.repository.js";
import AppError from "../utils/app-error.js";
import {
  createUsageSchema,
  deleteUsageByUserSchema,
  getLastSixMonthsUsageByUserSchema,
  getUsageByUserAndMonthSchema,
  updateUsageByUserAndMonthSchema,
  updateUsageSchema,
  usageParamsSchema,
} from "../schemas/usage.schema.js";
import { userTokenSchema } from "../utils/zod.utils.js";

/**
 * Creates a new usage document with the given data.
 * If a usage document for the given user and month already exists, it will be returned instead.
 * @param {Partial<IUsage>} data - Usage data to create
 * @returns {Promise<IUsage>} Created usage document if found, null otherwise
 * @throws {AppError} If usage data is invalid or if user or month is missing
 */
export const createUsageService = async (data: IUsageInput) => {
  const validated = createUsageSchema.parse(data);

  const existingUsage = await getUsageByUserAndMonth(
    validated.user,
    validated.month,
  );

  // If usage document already exists, return it instead of creating a new one
  if (existingUsage) return existingUsage;

  const usage = await createUsage(validated);
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
  const validated = getUsageByUserAndMonthSchema.parse({ userId, month });

  const usage = await getUsageByUserAndMonth(validated.userId, validated.month);

  if (!usage) throw new AppError("Usage not found", 404);

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

/**
 * Retrieves the last six months of usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<IUsage[]>} Array of usage documents if found, empty array otherwise
 * @throws {AppError} If user ID is invalid or missing
 */
export const getLastSixMonthsUsageByUserService = async (userId: string) => {
  const validated = getLastSixMonthsUsageByUserSchema.parse({ userId });

  const usage = await getLastSixMonthsUsageByUser(validated.userId);
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
  data: Partial<IUsageInput>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { usageId } = usageParamsSchema.parse({ usageId: id });
  const validated = updateUsageSchema.parse(data);
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingUsage = await getUsageById(usageId);

  if (!existingUsage) {
    throw new AppError("Usage document not found", 404);
  }

  if (
    existingUsage.user.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError(
      "You are not authorized to update this usage document",
      403,
    );
  }

  const usage = await updateUsage(usageId, validated);
  return usage;
};

export const updateUsageByUserAndMonthService = async (
  userId: string,
  tokensUsed: number,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const validated = updateUsageByUserAndMonthSchema.parse({
    userId,
    tokensUsed,
  });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  if (validated.userId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError(
      "You are not authorized to update this usage document",
      403,
    );
  }

  const usage = await incrementOnlyTokensUsed(
    validated.userId,
    validated.tokensUsed,
  );
  return usage;
};

/** * Deletes all usage documents belonging to a user
 * @param {string} userId - User ID
 * @param {string} currentUserId - ID of the user making the request (for authorization)
 * @param {"user" | "admin"} role - Role of the user making the request (for authorization)
 * @returns {Promise<DeleteResult>} Result of delete operation
 * @throws {AppError} If user ID is invalid or missing
 */
export const deleteUsageByUserService = async (
  userId: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const validated = deleteUsageByUserSchema.parse({ userId });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingUsage = await getUsageByUser(validated.userId);

  if (!existingUsage) {
    throw new AppError("No usage documents found for the user", 404);
  }

  if (
    existingUsage[0].user.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError(
      "You are not authorized to delete usage documents for this user",
      403,
    );
  }

  const usage = await deleteUsageByUser(validated.userId);

  if (usage.deletedCount === 0) {
    throw new AppError("No usage documents found for the user", 404);
  }

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
  const { usageId } = usageParamsSchema.parse({ usageId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingUsage = await getUsageById(usageId);

  if (!existingUsage) {
    throw new AppError("Usage document not found", 404);
  }

  if (
    existingUsage.user._id.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError(
      "You are not authorized to delete this usage document",
      403,
    );
  }

  const usage = await deleteUsage(id);

  return usage;
};
