import Usage, { IUsageInput, IUsagePopulated } from "../models/usage.model.js";
import dayjs from "dayjs";

/**
 * Creates a new usage with the given data
 * @param {Partial<IUsage>} data - Usage data to create
 * @returns {Promise<IUsage>} Created usage
 * @throws {MongooseError} If usage data is invalid
 */
export const createUsage = async (data: IUsageInput) => {
  const usage = new Usage(data);
  return await usage.save();
};

/**
 * Increments the tokensUsed, documentsUploaded and storageAdded counts for a given user and month, or creates a new document if it does not exist
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used to increment the tokensUsed count by
 * @param {number} storageAdded - Amount of storage used to increment the storageAdded count by
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementUsage = async (
  userId: string,
  tokensUsed: number,
  storageAdded: number,
) => {
  const month = new Date().toISOString().slice(0, 7);

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        tokensUsed,
        documentsUploaded: 1,
        storageAdded,
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
    .select("-tokensUsed")
    .sort({ month: -1 })
    .limit(6)
    .lean();
};

/**
 * Retrieves the total number of AI requests for a given user and month
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<number>} Total number of AI requests for the given user and month
 * @throws {MongooseError} If usage data is invalid
 */
export const getTotalAIRequests = async (userId: string, month: string) => {
  const usage = await Usage.findOne({ user: userId, month: month })
    .select("aiRequests")
    .lean();

  if (!usage) return 0;

  return usage?.aiRequests || 0;
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
 * Retrieves the daily messages for a given user and month
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage[]>} Array of daily messages if found, empty array otherwise
 * @throws {MongooseError} If usage data is invalid
 */
export const getDailyMessagesUsageByUserAndMonth = async (
  userId: string,
  month: string,
) => {
  return await Usage.findOne({ user: userId, month: month })
    .select("_id user month dailyMessages")
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
export const updateUsage = async (id: string, data: Partial<IUsageInput>) => {
  return await Usage.findByIdAndUpdate(id, data, { returnDocument: "after" })
    .populate({
      path: "user",
      select: "_id email plan",
    })
    .sort({ month: -1 })
    .lean();
};

/**
 * Gets or creates a usage document for a given user and month (read-only intent)
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage>} Existing or newly created usage document
 */
export const getOrCreateUsageByUserAndMonth = async (
  userId: string,
  month: string,
) => {
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
 * Updates a usage document for a given user and month (write intent)
 * @param {string} userId - User ID
 * @param {string} month - Month in format "YYYY-MM"
 * @returns {Promise<IUsage>} Existing or newly created usage document
 */
export const updateUsageMonthByUser = async (userId: string, month: string) => {
  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {},
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
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
 * Increments the aiRequests count for a given user and month, or creates a new document if it does not exist
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used to increment the tokensUsed count by
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementOnlyAIRequests = async (
  userId: string,
  tokensUsed: number,
) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        aiRequests: 1,
        tokensUsed,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

/**
 * Increments the dailyMessages and totalMessages counts for a given user and month, or creates a new document if it does not exist
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used to increment the tokensUsed count by
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementOnlyDailyAndTotalMessages = async (
  userId: string,
  tokensUsed: number,
) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const today = dayjs().format("YYYY-MM-DD");

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        [`dailyMessages.${today}`]: 1,
        totalMessages: 1,
        tokensUsed,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

/**
 * Increments the aiRequests, dailyMessages, totalMessages and tokensUsed counts for a given user and month, or creates a new document if it does not exist
 * @param {string} userId - User ID
 * @param {number} tokensUsed - Amount of tokens used
 * @returns {Promise<IUsage>} Updated or created usage document
 * @throws {MongooseError} If usage data is invalid
 */
export const incrementAIMessagesUsage = async (
  userId: string,
  tokensUsed: number,
) => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const today = dayjs().format("YYYY-MM-DD");

  return await Usage.findOneAndUpdate(
    { user: userId, month },
    {
      $inc: {
        [`dailyMessages.${today}`]: 1,
        aiRequests: 1,
        totalMessages: 1,
        tokensUsed,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
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
