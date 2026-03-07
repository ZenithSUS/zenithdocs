import mongoose from "mongoose";
import {
  deleteMessages,
  getChatByDocument,
  getChatById,
} from "../repositories/chat.repository.js";
import AppError from "../utils/app-error.js";

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
  console.log(chatId, userId);
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
