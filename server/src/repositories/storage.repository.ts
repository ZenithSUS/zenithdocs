import Storage from "../models/storage.model.js";

/**
 * Retrieves a storage document by user ID
 * @param {string} userId - User ID
 * @returns {Promise<IStorage | null>} Storage document if found, null otherwise
 * @throws {MongooseError} If storage data is invalid
 */
export const getStorageByUser = (userId: string) => {
  return Storage.findOne({ user: userId }).lean();
};

/**
 * Updates a storage document for a given user, or creates a new one if it does not exist
 * @param {string} userId - User ID
 * @param {number} size - Amount of storage to increment the totalUsed count by
 * @returns {Promise<IStorage>} Updated or created storage document
 * @throws {MongooseError} If storage data is invalid
 */
export const upsertStorage = async (userId: string, size: number) => {
  return await Storage.findOneAndUpdate(
    { user: userId },
    { $inc: { totalUsed: size } },
    { upsert: true, returnDocument: "after" },
  ).lean();
};

/**
 * Resets the totalUsed count of a user's storage to 0
 * @param {string} userId - User ID
 * @returns {Promise<IStorage>} Updated storage document
 * @throws {MongooseError} If storage data is invalid
 */
export const resetStorage = (userId: string) => {
  return Storage.findOneAndUpdate(
    { user: userId },
    { totalUsed: 0 },
    { returnDocument: "after" },
  ).lean();
};

/**
 * Retrieves a storage document by user ID, or creates a new one if it does not exist.
 * If the document does not exist, it will be created with the totalUsed count set to 0.
 * @param {string} userId - User ID
 * @returns {Promise<IStorage>} Storage document if found, created storage document if not found
 * @throws {MongooseError} If storage data is invalid
 */
export const getOrCreateStorage = async (userId: string) => {
  return await Storage.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { totalUsed: 0 } },
    { upsert: true, returnDocument: "after" },
  ).lean();
};
