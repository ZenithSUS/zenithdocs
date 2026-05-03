import { IUserScoreInput } from "../models/user-score.model.js";
import { getLearningSetById } from "../repositories/learning-set.repository.js";
import {
  createUserScore,
  deleteUserScore,
  getUserScoreById,
  getUserScoreByUserAndLearningSetId,
  updateUserScore,
} from "../repositories/user-score.repository.js";
import {
  createUserScoreSchema,
  getUserScoreByUserAndLearningSetSchema,
  updateUserScoreSchema,
  userScoreParamsSchema,
} from "../schemas/user-score.schema.js";
import AppError from "../utils/app-error.js";
import { userTokenSchema } from "../utils/zod.utils.js";

/**
 * Creates a new user score based on the given data.
 * The data must conform to the IUserScoreInput interface.
 * The learning set must exist and the authenticated user must be the owner or an admin.
 * @param {IUserScoreInput} data - The data for the new user score.
 * @returns {Promise<IUserScore>} The newly created user score.
 * @throws {AppError} If the learning set is not found.
 * @throws {AppError} If the authenticated user is not the owner or an admin.
 */
export const createUserScoreService = async (data: IUserScoreInput) => {
  const validData = createUserScoreSchema.parse(data);

  const learningSet = await getLearningSetById(validData.learningSetId);

  if (!learningSet) {
    throw new AppError("Learning set not found", 404);
  }

  const existingUserScore = await getUserScoreByUserAndLearningSetId(
    validData.userId,
    validData.learningSetId,
  );

  if (existingUserScore) {
    throw new AppError("User score already exists", 409);
  }

  const userScore = await createUserScore(validData);
  return userScore;
};

/**
 * Retrieves a user score by the given ID.
 * The user score must exist.
 * @param {string} id - User score ID
 * @returns {Promise<IUserScore>} The user score with the given ID.
 * @throws {AppError} If the user score is not found.
 */
export const getUserScoreByIdService = async (id: string) => {
  const { userScoreId } = userScoreParamsSchema.parse({ userScoreId: id });
  const userScore = await getUserScoreById(userScoreId);

  if (!userScore) {
    throw new AppError("User score not found", 404);
  }

  return userScore;
};

/**
 * Retrieves a user score by the given user ID and learning set ID.
 * The user score must exist and the authenticated user must be the owner or an admin.
 * @param {string} userId - User ID
 * @param {string} learningSetId - Learning set ID
 * @param {string} currentUserId - Authenticated user ID
 * @param {"user" | "admin"} role - Authenticated user role
 * @returns {Promise<IUserScore>} The user score with the given user ID and learning set ID.
 * @throws {AppError} If the user score is not found.
 * @throws {AppError} If the authenticated user is not the owner or an admin.
 */
export const getUserScoreByUserAndLearningSetIdService = async (
  userId: string,
  learningSetId: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const validated = getUserScoreByUserAndLearningSetSchema.parse({
    userId,
    learningSetId,
  });

  const userScore = await getUserScoreByUserAndLearningSetId(
    validated.userId,
    validated.learningSetId,
  );

  if (
    userScore &&
    userScore.userId.toString() !== currentUserId &&
    role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  return userScore;
};

/**
 * Updates a user score by ID with the given data.
 * The data must conform to the Partial<IUserScoreInput> interface.
 * The user score must exist and the authenticated user must be the owner or an admin.
 * @param {string} id - User score ID to update
 * @param {Partial<IUserScoreInput>} data - Data to update the user score with
 * @returns {Promise<IUserScore>} The updated user score
 * @throws {AppError} If the user score is not found
 * @throws {AppError} If the authenticated user is not the owner or an admin
 */
export const updateUserScoreService = async (
  id: string,
  data: Partial<IUserScoreInput>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { userScoreId } = userScoreParamsSchema.parse({ userScoreId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });
  const validated = updateUserScoreSchema.parse(data);

  const existingUserScore = await getUserScoreById(userScoreId);

  if (!existingUserScore) {
    throw new AppError("User score not found", 404);
  }

  if (
    existingUserScore.userId.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  const userScore = await updateUserScore(userScoreId, validated);
  return userScore;
};

/**
 * Deletes a user score by ID.
 * The user score must exist.
 * @param {string} id - User score ID to delete
 * @param {string} currentUserId - ID of the currently authenticated user
 * @param {"user" | "admin"} role - Role of the currently authenticated user
 * @returns {Promise<IUserScore>} The deleted user score
 * @throws {AppError} If the user score is not found
 */
export const deleteUserScoreService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { userScoreId } = userScoreParamsSchema.parse({ userScoreId: id });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const existingUserScore = await getUserScoreById(userScoreId);

  if (!existingUserScore) {
    throw new AppError("User score not found", 404);
  }

  if (
    existingUserScore.userId.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  const userScore = await deleteUserScore(userScoreId);
  return userScore;
};
