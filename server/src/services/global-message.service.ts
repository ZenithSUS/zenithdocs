import AppError from "../utils/app-error.js";
import {
  deleteGlobalMessagesByChatAndUserId,
  getGlobalMessagesByChatIdPaginated,
} from "../repositories/global-message.repository.js";
import {
  getGlobalChatByUserId,
  updateGlobalChatSummary,
} from "../repositories/global-chat.repository.js";
import {
  deleteGlobalMessagesSchema,
  getGlobalMessagesPaginatedSchema,
} from "../schemas/global-message.schema.js";

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
  const validated = getGlobalMessagesPaginatedSchema.parse({
    chatId,
    page,
    limit,
  });

  const globalMessages = await getGlobalMessagesByChatIdPaginated(
    validated.chatId,
    validated.page,
    validated.limit,
  );

  return globalMessages;
};

/**
 * Deletes all global messages associated with a given chat ID and user ID.
 * @param {string} chatId - The ID of the chat to delete global messages for.
 * @param {string} userId - The ID of the user to delete global messages for.
 * @returns {Promise<number>} The number of global messages deleted.
 * @throws {ZodError} If chat ID is invalid or missing.
 * @throws {ZodError} If user ID is invalid or missing.
 * @throws {AppError} If chat is not found.
 */
export const deleteGlobalMessagesByChatAndUserIdService = async (
  chatId: string,
  userId: string,
) => {
  const validated = deleteGlobalMessagesSchema.parse({ chatId, userId });

  const globalChat = await getGlobalChatByUserId(validated.userId);
  if (!globalChat) {
    throw new AppError("Global chat not found", 404);
  }

  if (globalChat.userId.toString() !== validated.userId) {
    throw new AppError("Forbidden", 403);
  }

  const globalMessages = await deleteGlobalMessagesByChatAndUserId(
    validated.chatId,
    validated.userId,
  );

  await updateGlobalChatSummary(validated.userId, "");

  return globalMessages;
};
