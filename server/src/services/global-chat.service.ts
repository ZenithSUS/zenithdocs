import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  createGlobalChat,
  deleteGlobalChatByUserId,
  getGlobalChatByUserId,
} from "../repositories/global-chat.repository.js";

/**
 * Initializes a global chat document for a given user ID.
 * If the global chat document does not exist, it will be created.
 * @throws {AppError} If user ID is invalid or missing
 * @param {string} userId - The ID of the user to initialize the global chat for.
 * @returns {Promise<IGlobalChat>} The initialized global chat document.
 */
export const initGlobalChatService = async (userId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  let globalChat = await getGlobalChatByUserId(userId);
  if (!globalChat) {
    globalChat = await createGlobalChat({
      userId: new mongoose.Types.ObjectId(userId),
      summary: "",
    });
  }

  return globalChat;
};

/**
 * Retrieves a global chat document associated with a given user ID.
 * @throws {AppError} If user ID is invalid or missing
 * @param {string} userId - The ID of the user to retrieve the global chat for.
 * @param {string} currentUserId - The ID of the currently authenticated user.
 * @returns {Promise<IGlobalChat | null>} The global chat document if found, null otherwise.
 */
export const getGlobalChatByUserService = async (
  userId: string,
  currentUserId: string,
) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (userId !== currentUserId) {
    throw new AppError("Forbidden", 403);
  }

  const globalChat = await getGlobalChatByUserId(userId);

  return globalChat;
};

/**
 * Deletes a global chat document associated with a given user ID.
 * @throws {AppError} If user ID is invalid or missing
 * @param {string} userId - The ID of the user to delete the global chat for.
 * @param {string} currentUserId - The ID of the currently authenticated user.
 * @returns {Promise<IGlobalChat | null>} The deleted global chat document if found, null otherwise.
 */
export const deleteGlobalChatByUserService = async (
  userId: string,
  currentUserId: string,
) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (userId !== currentUserId) {
    throw new AppError("Forbidden", 403);
  }

  const userGlobalChat = await getGlobalChatByUserId(userId);

  if (!userGlobalChat) {
    throw new AppError("Global chat not found", 404);
  }

  if (userGlobalChat.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const globalChat = await deleteGlobalChatByUserId(userId);

  return globalChat;
};
