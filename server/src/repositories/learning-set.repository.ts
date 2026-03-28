import LearningSet, { ILearningSetInput } from "../models/LearningSet.js";

/**
 * Creates a new learning set based on the given data.
 * The data must conform to the ILearningSetInput interface.
 * @param {ILearningSetInput} data - The data for the new learning set.
 * @returns {Promise<ILearningSet>} The newly created learning set.
 */
export const createLearningSet = async (data: ILearningSetInput) => {
  const learningSet = await LearningSet.create(data);
  const createdLearningSet = await LearningSet.findById(learningSet._id).select(
    "-chunkHashes",
  );
  return createdLearningSet;
};

/**
 * Retrieves a learning set by its ID.
 * @param {string} id - The ID of the learning set to retrieve.
 * @returns {Promise<ILearningSet>} The learning set with the given ID.
 * @throws {AppError} If the learning set is not found.
 */
export const getLearningSetById = async (id: string) => {
  const learningSet = await LearningSet.findById(id)
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .select("-chunkHashes")
    .lean();

  return learningSet;
};

/**
 * Retrieves all learning sets associated with a given user ID in a paginated manner.
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of learning sets to retrieve per page
 * @returns {Promise<{ learningSets: ILearningSet[], pagination: { page: number, limit: number, total: number, totalPages: number } >}}
 * An object containing the learning sets and pagination information.
 * @throws {ZodError} If user ID is invalid or missing
 * @throws {ZodError} If page or limit is invalid or missing
 * @throws {ZodError} If page or limit is not a positive integer
 */
export const getLearningSetsByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const learningSets = await LearningSet.find({ ownerId: userId })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .select("-chunkHashes")
    .sort({ createdAt: -1 })
    .lean();

  const total = await LearningSet.countDocuments({ ownerId: userId });

  return {
    learningSets,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Updates a learning set by ID with the given data.
 * The data must conform to the Partial<ILearningSetInput> interface.
 * The learning set must exist and the authenticated user must be the owner or an admin.
 * @param {string} id - Learning set ID to update
 * @param {Partial<ILearningSetInput>} data - Data to update the learning set with
 * @returns {Promise<ILearningSet>} The updated learning set
 * @throws {AppError} If the learning set is not found
 * @throws {AppError} If the authenticated user is not the owner or an admin
 */
export const updateLearningSet = async (
  id: string,
  data: Partial<ILearningSetInput>,
) => {
  const learningSet = await LearningSet.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  })
    .populate({
      path: "documentId",
      select: "_id title fileType fileSize fileUrl",
    })
    .populate({
      path: "ownerId",
      select: "_id email",
    })
    .select("-chunkHashes")
    .lean();

  return learningSet;
};

/**
 * Deletes a learning set by ID.
 * The learning set must exist.
 * @param {string} id - Learning set ID to delete
 * @returns {Promise<ILearningSet>} The deleted learning set
 * @throws {AppError} If the learning set is not found
 */
export const deleteLearningSet = async (id: string) => {
  const learningSet = await LearningSet.findByIdAndDelete(id);
  return learningSet;
};
