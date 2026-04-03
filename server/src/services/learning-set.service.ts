import { ILearningSetInput } from "../models/learning-set.model.js";
import { getDocumentById } from "../repositories/document.repository.js";
import {
  createLearningSet,
  deleteLearningSet,
  getLearningSetById,
  getLearningSetsByUserPaginated,
  updateLearningSet,
} from "../repositories/learning-set.repository.js";
import {
  createLearningSetSchema,
  getLearningSetByUserPageSchema,
  learningSetParamsSchema,
  updateLearningSetSchema,
} from "../schemas/learning-set.schema.js";
import AppError from "../utils/app-error.js";
import { userTokenSchema } from "../utils/zod.utils.js";

/**
 * Creates a new learning set based on the given data.
 * The data must conform to the ILearningSetInput interface.
 * The documentId field must refer to an existing document.
 * If the document is not found, an AppError with status code 404 is thrown.
 * @param {ILearningSetInput} data - The data for the new learning set.
 * @returns {Promise<ILearningSet>} The newly created learning set.
 * @throws {AppError} If the document is not found.
 */
export const createLearningSetService = async (data: ILearningSetInput) => {
  const validated = createLearningSetSchema.parse(data);

  const document = await getDocumentById(validated.documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  const learningSet = await createLearningSet(validated);
  return learningSet;
};

/**
 * Retrieves a learning set by its ID.
 * @param {string} id - The ID of the learning set to retrieve.
 * @param {string} currentUserId - The ID of the user making the request.
 * @param {"user"|"admin"} role - The role of the user making the request.
 * @throws {AppError} If the learning set is not found.
 * @throws {AppError} If the user does not have permission to access the learning set.
 * @returns {Promise<ILearningSet>} The learning set with the given ID.
 */
export const getLearningSetByIdService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { learningSetId } = learningSetParamsSchema.parse({
    learningSetId: id,
  });

  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const learningSet = await getLearningSetById(learningSetId);

  if (!learningSet) {
    throw new AppError("Learning set not found", 404);
  }

  const ownerId = learningSet.ownerId._id.toString();

  if (ownerId !== authUser.userId && authUser.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  return learningSet;
};

/**
 * Retrieves all learning sets associated with a given user ID in a paginated manner.
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of learning sets to retrieve per page
 * @returns {Promise<ILearningSet[]>} An array of learning sets associated with the user
 * @throws {ZodError} If user ID is invalid or missing
 * @throws {ZodError} If page or limit is invalid or missing
 * @throws {ZodError} If page or limit is not a positive integer
 */
export const getLearningSetsByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getLearningSetByUserPageSchema.parse({
    userId,
    page,
    limit,
  });

  const learningSets = await getLearningSetsByUserPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );

  return learningSets;
};

/**
 * Updates a learning set by ID with the given data.
 * The data must conform to the Partial<ILearningSetInput> interface.
 * The learning set must exist and the authenticated user must be the owner or an admin.
 * @param {string} id - Learning set ID to update
 * @param {Partial<ILearningSetInput>} data - Data to update the learning set with
 * @param {string} currentUserId - Authenticated user ID
 * @param {"user" | "admin"} role - Authenticated user role
 * @returns {Promise<ILearningSet>} The updated learning set
 * @throws {AppError} If the learning set is not found
 * @throws {AppError} If the authenticated user is not the owner or an admin
 */
export const updateLearningSetByIdService = async (
  id: string,
  data: Partial<ILearningSetInput>,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { learningSetId } = learningSetParamsSchema.parse({
    learningSetId: id,
  });
  const authUser = userTokenSchema.parse({ userId: currentUserId, role });
  const validated = updateLearningSetSchema.parse(data);

  const learningSet = await getLearningSetById(learningSetId);

  if (!learningSet) {
    throw new AppError("Learning set not found", 404);
  }

  if (
    learningSet.ownerId._id.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  const updatedLearningSet = await updateLearningSet(learningSetId, validated);
  return updatedLearningSet;
};

/**
 * Deletes a learning set by ID.
 * The learning set must exist and the authenticated user must be the owner or an admin.
 * @param {string} id - Learning set ID to delete
 * @param {string} currentUserId - Authenticated user ID
 * @param {"user" | "admin"} role - Authenticated user role
 * @returns {Promise<ILearningSet>} The deleted learning set
 * @throws {AppError} If the learning set is not found
 * @throws {AppError} If the authenticated user is not the owner or an admin
 */
export const deleteLearningSetByIdService = async (
  id: string,
  currentUserId: string,
  role: "user" | "admin",
) => {
  const { learningSetId } = learningSetParamsSchema.parse({
    learningSetId: id,
  });

  const authUser = userTokenSchema.parse({ userId: currentUserId, role });

  const learningSet = await getLearningSetById(learningSetId);

  if (!learningSet) {
    throw new AppError("Learning set not found", 404);
  }

  if (
    learningSet.ownerId._id.toString() !== authUser.userId &&
    authUser.role !== "admin"
  ) {
    throw new AppError("Forbidden", 403);
  }

  const deletedLearningSet = await deleteLearningSet(learningSetId);
  return deletedLearningSet;
};
