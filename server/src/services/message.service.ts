import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  deleteMessagesByChatAndUser,
  getMessageByChatIdPaginated,
} from "../repositories/message.repository.js";
import {
  getChatById,
  updateChatSummary,
} from "../repositories/chat.repository.js";

/**
 * Retrieves all messages associated with a given chat ID in a paginated manner.
 * @param {string} chatId - Chat ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of messages to retrieve per page
 * @returns {Promise<IChatMessage[]>} An array of chat messages associated with the chat ID.
 * @throws {AppError} If chat ID is invalid or missing.
 * @throws {AppError} If page or limit is invalid or missing.
 * @throws {AppError} If page or limit is not a positive integer.
 */
export const getMessagesByChatIdPaginatedService = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new AppError("Invalid chat ID", 400);
  }

  if (!page || !limit) {
    throw new AppError("Page and limit is required", 400);
  }

  if (page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive integers", 400);
  }

  const messages = await getMessageByChatIdPaginated(chatId, page, limit);
  return messages;
};

/**
 * Deletes all messages associated with a given chat ID and user ID.
 * @throws {AppError} If chat ID is invalid or missing.
 * @throws {AppError} If user ID is invalid or missing.
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {"admin" | "user"} role - User role
 * @returns {Promise<number>} The number of messages deleted.
 */
export const deleteMessagesByChatIdAndUserService = async (
  chatId: string,
  userId: string,
) => {
  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new AppError("Invalid chat ID", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const messages = await deleteMessagesByChatAndUser(chatId, userId);

  // Remove Summary
  await updateChatSummary(chatId, "");

  return messages;
};
