import { Types } from "mongoose";
import Chat, { IChat } from "../models/Chat.js";

/**
 * Creates a new chat document with the given data.
 * @param {Partial<IChat>} data - The data to create the chat with.
 * @returns {Promise<IChat>} The created chat document.
 */
export const createChat = async (data: Partial<IChat>) => {
  const chat = await Chat.create(data);
  return chat;
};

/**
 * Retrieves a chat document by document ID and user ID.
 * @param {string} documentId - The ID of the document to retrieve the chat for.
 * @param {string} userId - The ID of the user to retrieve the chat for.
 * @returns {Promise<IChat | null>} The chat document if found, null otherwise.
 */
export const getChatByDocument = async (documentId: string, userId: string) => {
  return await Chat.findOne({
    documentId: new Types.ObjectId(documentId),
    userId: new Types.ObjectId(userId),
  });
};

/**
 * Retrieves all chat documents associated with a given user ID.
 * @param {string} userId - The ID of the user to retrieve chat documents for.
 * @returns {Promise<IChat[]>} An array of chat documents associated with the user.
 */
export const getChatByUser = async (userId: string) => {
  return await Chat.find({ userId: new Types.ObjectId(userId) });
};

/**
 * Retrieves all chat documents associated with a given user ID in a paginated manner.
 * @param {string} userId - The ID of the user to retrieve chat documents for.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of chat documents to retrieve per page.
 * @returns {Promise<IChat[]>} An array of chat documents associated with the user.
 */
export const getChatByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const chats = await Chat.find({ userId: new Types.ObjectId(userId) })
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Chat.countDocuments({
    userId: new Types.ObjectId(userId),
  });

  return {
    chats,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves a chat document by its ID.
 * @param {string} id - The ID of the chat document to retrieve.
 * @returns {Promise<IChat | null>} The chat document if found, null otherwise.
 */
export const getChatById = async (id: string) => {
  return await Chat.findById(id);
};

/**
 * Updates the summary of a chat document.
 * @param {string} chatId - The ID of the chat document to update the summary for.
 * @param {string} summary - The new summary to set for the chat document.
 * @returns {Promise<IChat>} The updated chat document.
 */
export const updateChatSummary = async (chatId: string, summary: string) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { summary },
    { returnDocument: "after" },
  );
};

/**
 * Deletes a chat document by its ID.
 * @param {string} id - The ID of the chat document to delete.
 * @returns {Promise<IChat | null>} The deleted chat document if found, null otherwise.
 */
export const deleteChat = async (id: string) => {
  const chat = await Chat.findByIdAndDelete(id);
  return chat;
};

/**
 * Deletes all messages associated with a chat document.
 * @param {string} chatId - The ID of the chat document to delete messages from.
 * @returns {Promise<IChat>} The updated chat document with all messages deleted.
 */
export const deleteMessages = async (chatId: string) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { $set: { messages: [] } },
    { returnDocument: "after" },
  );
};
