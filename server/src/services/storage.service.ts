import {
  getOrCreateStorage,
  getStorageByUser,
  resetStorage,
  upsertStorage,
} from "../repositories/storage.repository.js";

/**
 * Adds storage to a user's account
 * @param {string} userId - User ID
 * @param {number} size - Amount of storage to add (in bytes)
 * @returns {Promise<IStorage>} Updated storage document
 * @throws {MongooseError} If storage data is invalid
 */
export const addStorageService = async (userId: string, size: number) => {
  const storage = await upsertStorage(userId, size);

  return storage;
};

/**
 * Removes storage from a user's account
 * @param {string} userId - User ID
 * @param {number} size - Amount of storage to remove (in bytes)
 * @returns {Promise<IStorage>} Updated storage document
 * @throws {MongooseError} If storage data is invalid
 * If the total used storage after removal is less than the amount removed, the user's storage is reset to 0.
 */
export const removeStorageService = async (userId: string, size: number) => {
  const storage = await upsertStorage(userId, -size);

  if (storage.totalUsed < size) {
    return await resetStorage(userId);
  }

  return storage;
};

/**
 * Retrieves the total used storage for a user
 * @param {string} userId - User ID
 * @returns {Promise<IStorage | null>} Storage document if found, null otherwise
 * @throws {MongooseError} If storage data is invalid
 */
export const getStorageByUserService = (userId: string) => {
  const storage = getStorageByUser(userId);

  return storage;
};

/**
 * Retrieves a storage document by user ID, or creates a new one if it does not exist
 * @param {string} userId - User ID
 * @returns {Promise<IStorage>} Storage document if found, new storage document if not found
 * @throws {MongooseError} If storage data is invalid
 */
export const getOrCreateStorageService = async (userId: string) => {
  const storage = await getOrCreateStorage(userId);

  return storage;
};
