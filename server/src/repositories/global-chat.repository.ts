import GlobalChat, { IGlobalChat } from "../models/global-chat.model.js";

/**
 * Creates a new global chat document with the given data.
 * @param {Partial<IGlobalChat>} data - The data to create the global chat with.
 * @returns {Promise<IGlobalChat>} The created global chat document.
 */
export const createGlobalChat = async (data: Partial<IGlobalChat>) => {
  const globalChat = await GlobalChat.create(data);
  return globalChat;
};

/**
 * Retrieves a global chat document by its user ID.
 * @param {string} userId - The user ID to retrieve the global chat for.
 * @returns {Promise<IGlobalChat | null>} The global chat document if found, null otherwise.
 */
export const getGlobalChatByUserId = async (userId: string) => {
  const globalChat = await GlobalChat.findOne({ userId });
  return globalChat;
};

/**
 * Updates the summary of a global chat document.
 * @param {string} userId - The ID of the user to update the summary for.
 * @param {string} summary - The new summary to set for the global chat document.
 * @returns {Promise<IGlobalChat | null>} The updated global chat document if found, null otherwise.
 */
export const updateGlobalChatSummary = async (
  userId: string,
  summary: string,
) => {
  const globalChat = await GlobalChat.findOneAndUpdate(
    { userId },
    { summary },
    { returnDocument: "after" },
  );
  return globalChat;
};

/**
 * Deletes a global chat document by its user ID.
 * @param {string} userId - The user ID to delete the global chat for.
 * @returns {Promise<IGlobalChat | null>} The deleted global chat document if found, null otherwise.
 */
export const deleteGlobalChatByUserId = async (userId: string) => {
  const globalChat = await GlobalChat.findOneAndDelete({ userId });
  return globalChat;
};
