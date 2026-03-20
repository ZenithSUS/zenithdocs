import mongoose from "mongoose";
import AppError from "../utils/app-error.js";
import {
  createGlobalChat,
  deleteGlobalChatByUserId,
  getGlobalChatByUserId,
} from "../repositories/global-chat.repository.js";
import {
  globalChatAuthSchema,
  globalChatParamsSchema,
} from "../schemas/global-chat.schema.js";

/**
 * Initializes a global chat document for a given user ID.
 * If the global chat document does not exist, it will be created.
 * @throws {AppError} If user ID is invalid or missing
 * @param {string} userId - The ID of the user to initialize the global chat for.
 * @returns {Promise<IGlobalChat>} The initialized global chat document.
 */
export const initGlobalChatService = async (userId: string) => {
  const { userId: validatedId } = globalChatParamsSchema.parse({ userId });

  let globalChat = await getGlobalChatByUserId(validatedId);
  if (!globalChat) {
    globalChat = await createGlobalChat({
      userId: new mongoose.Types.ObjectId(validatedId),
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
  const validated = globalChatAuthSchema.parse({ userId, currentUserId });

  if (validated.userId !== validated.currentUserId) {
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
  const validated = globalChatAuthSchema.parse({ userId, currentUserId });

  if (validated.userId !== validated.currentUserId) {
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
