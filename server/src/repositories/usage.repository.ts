import Usage, { IUsage, IUsagePopulated } from "../models/Usage.js";

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
 * Increments a usage document by a given amount of tokens used and documents uploaded
 * If a usage document for the given user and month already exists, it will be updated
 * If a usage document for the given user and month does not exist, it will be created
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used to increment the tokensUsed count by
 * @returns {Promise<IUsage>} Updated usage document if found, created usage document if not found
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementUsage = async (userId: string, tokensUsed: number) => {
  const month = new Date().toISOString().slice(0, 7);

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        tokensUsed,
        documentsUploaded: 1,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  );
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
      select: "_id email plan",
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
      select: "_id email plan",
    })
    .lean<IUsagePopulated>();
};

/**
 * Retrieves the last six months of usage documents belonging to a user
 * @param {string} userId - User ID
 * @returns {Promise<IUsage[]>} Array of usage documents if found, empty array otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const getLastSixMonthsUsageByUser = async (userId: string) => {
  return await Usage.find({ user: userId })
    .populate({
      path: "user",
      select: "_id email plan",
    })
    .sort({ month: -1 })
    .limit(6)
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
      select: "_id email plan",
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
      select: "_id email plan",
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
      select: "_id email plan",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Updates a usage document for a given user and month, or creates a new one if it does not exist
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const updateUsageMonthByUser = async (userId: string, month: string) => {
  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {},
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).populate("user", "_id email plan");
};

/**
 * Increments the tokensUsed count for a given user and month, or creates a new document if it does not exist
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used to increment the tokensUsed count by
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementOnlyTokensUsed = async (
  userId: string,
  tokensUsed: number,
) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        tokensUsed,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();
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
