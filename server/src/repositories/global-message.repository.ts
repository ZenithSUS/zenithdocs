import mongoose from "mongoose";
import GlobalMessage, { IGlobalMessageInput } from "../models/GlobalMessage.js";

/**
 * Creates a new global message document with the given data.
 * @param {IGlobalMessageInput} data - The data to create the global message with.
 * @returns {Promise<IGlobalMessage>} The created global message document.
 */
export const createGlobalMessage = async (data: IGlobalMessageInput) => {
  const globalMessage = await GlobalMessage.create(data);
  return globalMessage;
};

export const getRecentGlobalMessagesByChatId = async (chatId: string) => {
  const globalMessages = await GlobalMessage.find({ chatId })
    .sort({
      createdAt: 1,
    })
    .limit(10);
  return globalMessages;
};

/**
 * Retrieves all global messages associated with a given chat ID in a paginated manner.
 * @param {string} chatId - The ID of the chat to retrieve global messages for.
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of global messages to retrieve per page.
 * @returns {Promise<{ globalMessages: IGlobalMessage[], pagination: { page: number, limit: number, total: number, totalPages: number } }>} An object containing the global messages and the pagination information.
 */
export const getGlobalMessagesByChatIdPaginated = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const globalMessages = await GlobalMessage.find({ chatId })
    .sort({
      createdAt: -1,
    })
    .select("-embedding")
    .skip(offset)
    .limit(limit)
    .lean();

  const total = await GlobalMessage.countDocuments({ chatId });

  return {
    globalMessages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves the total number of global messages associated with a given chat ID and user ID.
 * @param {string} chatId - The ID of the chat to retrieve global messages for.
 * @param {string} userId - The ID of the user to retrieve global messages for.
 * @returns {Promise<number>} The total number of global messages associated with the chat ID and user ID.
 */
export const getTotalGlobalMessagesByChatAndUserId = async (
  chatId: string,
  userId: string,
) => {
  return await GlobalMessage.countDocuments({
    chatId: new mongoose.Types.ObjectId(chatId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

/**
 * Deletes all global messages associated with a given chat ID and user ID.
 * @param {string} chatId - The ID of the chat to delete global messages for.
 * @param {string} userId - The ID of the user to delete global messages for.
 * @returns {Promise<number>} The number of global messages deleted.
 */
export const deleteGlobalMessagesByChatAndUserId = async (
  chatId: string,
  userId: string,
) => {
  return await GlobalMessage.deleteMany({
    chatId: new mongoose.Types.ObjectId(chatId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};
