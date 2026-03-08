import mongoose, { Types } from "mongoose";
import {
  createChat,
  deleteMessages,
  getChatByDocument,
  getChatById,
  getChatByUser,
  getChatByUserPaginated,
} from "../repositories/chat.repository.js";
import AppError from "../utils/app-error.js";

/**
 * Initializes a chat for a given document ID and user ID.
 * If the chat does not exist, it will be created.
 * @throws {AppError} If document ID or user ID is invalid or missing
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<Chat>} The initialized chat
 */
export const initChatForDocumentService = async (
  documentId: string,
  userId: string,
) => {
  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid document ID", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  let chat = await getChatByDocument(documentId, userId);
  if (!chat) {
    chat = await createChat({
      documentId: new Types.ObjectId(documentId),
      userId: new Types.ObjectId(userId),
      summary: "",
    });
  }

  return chat;
};

/**
 * Retrieves a chat by document ID and user ID
 * @throws {AppError} If document ID or user ID is invalid or missing
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<IChat | null>} Chat if found, null otherwise
 */
export const getChatByDocumentService = async (
  documentId: string,
  userId: string,
) => {
  if (!documentId) {
    throw new AppError("Document ID is required", 400);
  }

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new AppError("Invalid document ID", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const chat = await getChatByDocument(documentId, userId);

  return chat;
};

/**
 * Retrieves all chat documents associated with a given user ID.
 * @throws {AppError} If user ID is invalid or missing
 * @throws {AppError} If chat is not found
 * @param {string} userId - User ID
 * @returns {Promise<IChat | null>} Chat if found, null otherwise
 */
export const getChatByUserService = async (userId: string) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const chat = await getChatByUser(userId);
  return chat;
};

/**
 * Retrieves all chat documents associated with a given user ID in a paginated manner.
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of chat documents to retrieve per page
 * @returns {Promise<IChat[]>} An array of chat documents associated with the user
 * @throws {AppError} If user ID is invalid or missing
 * @throws {AppError} If page or limit is invalid or missing
 * @throws {AppError} If page or limit is not a positive integer
 */
export const getChatByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid User ID", 400);
  }

  if (!page || !limit) {
    throw new AppError("Page and limit is required", 400);
  }

  if (page < 1 || limit < 1) {
    throw new AppError("Page and limit must be positive integers", 400);
  }

  const chat = await getChatByUserPaginated(userId, page, limit);
  return chat;
};

/**
 * Deletes all messages associated with a given chat ID and user ID.
 * @throws {AppError} If chat ID or user ID is invalid or missing
 * @throws {AppError} If chat is not found
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @returns {Promise<IChat | null>} Deleted chat if found, null otherwise
 */
export const deleteChatMessagesService = async (
  chatId: string,
  userId: string,
  role: string,
) => {
  if (!chatId) {
    throw new AppError("Chat ID is required", 400);
  }

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    throw new AppError("Chat not found", 404);
  }

  if (chat.userId.toString() !== userId && role !== "admin") {
    throw new AppError("Unauthorized", 401);
  }

  const deletedChat = await deleteMessages(chatId);
  return deletedChat;
};
