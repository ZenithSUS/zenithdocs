import Usage, { IUsage } from "../models/Usage.js";

/**
 * Creates a new usage with the given data
 * @param {Partial<IUsage>} data - Usage data to create
 * @returns {Promise<IUsage>} Created usage
 * @throws {MongooseError} If usage data is invalid
 */
export const createUsage = async (data: Partial<IUsage>) => {
  const usage = new Usage(data);
  return await usage.save();
};

/**
 * Retrieves a usage document by ID
 * @param {string} id - Usage ID
 * @returns {Promise<IUsage>} Usage document if found, null otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const getUsageById = async (id: string) => {
  return await Usage.findById(id)
    .populate({
      path: "user",
      select: "_id email",
    })
    .lean();
};

/**
 * Retrieves a usage document by user ID and month
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage | null>} Usage document if found, null otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const getUsageByUserAndMonth = async (userId: string, month: string) => {
  return await Usage.findOne({ user: userId, month })
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Retrieves all usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<IUsage[]>} Array of usage documents if found, empty array otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const getUsageByUser = async (userId: string) => {
  return await Usage.find({ user: userId })
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Retrieves all usage documents from the database (populated with user email) - Admin Only
 * @returns {Promise<IUsage[]>} Array of all usage documents
 * @throws {MongooseError} If usage data is invalid
 */
export const getAllUsageAdmin = async () => {
  return await Usage.find()
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Updates a usage document by ID
 * @param {string} id - Usage ID
 * @param {Partial<IUsage>} data - Usage data to update
 * @returns {Promise<IUsage>} Updated usage document if found, null otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const updateUsage = async (id: string, data: Partial<IUsage>) => {
  return await Usage.findByIdAndUpdate(id, data, { returnDocument: "after" })
    .populate({
      path: "user",
      select: "_id email",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Deletes a usage document by ID
 * @param {string} id - Usage ID
 * @returns {Promise<IUsage | null>} Deleted usage document if found, null otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const deleteUsage = async (id: string) => {
  return await Usage.findByIdAndDelete(id);
};

/**
 * Deletes all usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<IUsage[]>} Array of deleted usage documents if found, empty array otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const deleteUsageByUser = async (userId: string) => {
  return await Usage.deleteMany({ user: userId });
};
