import AppError from "../utils/app-error.js";
import {
  deleteMessagesByChatAndUser,
  getMessageByChatIdPaginated,
} from "../repositories/message.repository.js";
import {
  getChatById,
  updateChatSummary,
} from "../repositories/chat.repository.js";
import {
  deleteMessagesByChatAndUserSchema,
  getMessagesByChatPageSchema,
} from "../schemas/message.schema.js";

/**
 * Retrieves all messages associated with a given chat ID in a paginated manner.
 * @param {string} chatId - Chat ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of messages to retrieve per page
 * @returns {Promise<IChatMessage[]>} An array of chat messages associated with the chat ID.
 * @throws {ZodError} If chat ID is invalid or missing.
 * @throws {ZodError} If page or limit is invalid or missing.
 * @throws {ZodError} If page or limit is not a positive integer.
 */
export const getMessagesByChatIdPaginatedService = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  const validated = getMessagesByChatPageSchema.parse({ chatId, page, limit });

  const messages = await getMessageByChatIdPaginated(
    validated.chatId,
    validated.page,
    validated.limit,
  );

  return messages;
};

/**
 * Deletes all messages associated with a given chat ID and user ID.
 * @throws {ZodError} If chat ID is invalid or missing.
 * @throws {ZodError} If user ID is invalid or missing.
 * @throws {AppError} If chat is not found.
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {"admin" | "user"} role - User role
 * @returns {Promise<number>} The number of messages deleted.
 */
export const deleteMessagesByChatIdAndUserService = async (
  chatId: string,
  userId: string,
) => {
  const validated = deleteMessagesByChatAndUserSchema.parse({ chatId, userId });

  const chat = await getChatById(validated.chatId);

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  const messages = await deleteMessagesByChatAndUser(
    validated.chatId,
    validated.userId,
  );

  // Remove Summary
  await updateChatSummary(validated.chatId, "");

  return messages;
};
