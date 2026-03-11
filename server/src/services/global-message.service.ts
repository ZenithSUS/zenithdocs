import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  deleteGlobalMessagesByChatAndUserId,
  getGlobalMessagesByChatIdPaginated,
} from "../repositories/global-message.repository.js";
import {
  getGlobalChatByUserId,
  updateGlobalChatSummary,
} from "../repositories/global-chat.repository.js";

/**
 * Retrieves all global messages associated with a given chat ID in a paginated manner.
 * @param {string} chatId - The ID of the chat to retrieve global messages for.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of global messages to retrieve per page.
 * @returns {Promise<{ globalMessages: IGlobalMessage[], pagination: { page: number, limit: number, total: number, totalPages: number } }>} An object containing the global messages and the pagination information.
 * @throws {AppError} If chat ID is invalid or missing.
 * @throws {AppError} If page or limit is invalid or missing.
 * @throws {AppError} If page or limit is not a positive integer.
 */
export const getGlobalMessagesByChatIdPaginatedService = async (
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

  const globalMessages = await getGlobalMessagesByChatIdPaginated(
    chatId,
    page,
    limit,
  );
  return globalMessages;
};

/**
 * Deletes all global messages associated with a given chat ID and user ID.
 * @param {string} chatId - The ID of the chat to delete global messages for.
 * @param {string} userId - The ID of the user to delete global messages for.
 * @returns {Promise<number>} The number of global messages deleted.
 * @throws {AppError} If chat ID is invalid or missing.
 * @throws {AppError} If user ID is invalid or missing.
 */
export const deleteGlobalMessagesByChatAndUserIdService = async (
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

  const globalChat = await getGlobalChatByUserId(userId);

  if (!globalChat) {
    throw new AppError("Global chat not found", 404);
  }

  if (globalChat.userId.toString() !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const globalMessages = await deleteGlobalMessagesByChatAndUserId(
    chatId,
    userId,
  );

  await updateGlobalChatSummary(userId, "");

  return globalMessages;
};
