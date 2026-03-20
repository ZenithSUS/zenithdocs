import {
  createChat,
  getChatByDocument,
  getChatByUser,
  getChatByUserPaginated,
} from "../repositories/chat.repository.js";
import {
  getChatByDocumentSchema,
  getChatByUserPageSchema,
  getChatByUserSchema,
  initChatDocumentSchema,
} from "../schemas/chat.schema.js";
import AppError from "../utils/app-error.js";

/**
 * Initializes a chat for a given document ID and user ID.
 * If the chat does not exist, it will be created.
 * @throws {ZodError} If document ID or user ID is invalid or missing
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<Chat>} The initialized chat
 */
export const initChatForDocumentService = async (
  documentId: string,
  userId: string,
) => {
  const validated = initChatDocumentSchema.parse({ documentId, userId });

  let chat = await getChatByDocument(validated.documentId, validated.userId);
  if (!chat) {
    chat = await createChat({
      documentId: validated.documentId,
      userId: validated.userId,
      summary: "",
    });
  }

  return chat;
};

/**
 * Retrieves a chat by document ID and user ID
 * @throws {ZodError} If document ID or user ID is invalid or missing
 * @param {string} documentId - Document ID
 * @param {string} userId - User ID
 * @returns {Promise<IChat | null>} Chat if found, null otherwise
 */
export const getChatByDocumentService = async (
  documentId: string,
  userId: string,
) => {
  const validated = getChatByDocumentSchema.parse({ documentId, userId });
  const chat = await getChatByDocument(validated.documentId, validated.userId);

  return chat;
};

/**
 * Retrieves all chat documents associated with a given user ID.
 * @throws {ZodError} If user ID is invalid or missing
 * @throws {AppError} If chat is not found
 * @param {string} userId - User ID
 * @returns {Promise<IChat | null>} Chat if found, null otherwise
 */
export const getChatByUserService = async (userId: string) => {
  const validated = getChatByUserSchema.parse({ userId });

  const chat = await getChatByUser(validated.userId);

  if (!chat) throw new AppError("Chat not found", 404);

  return chat;
};

/**
 * Retrieves all chat documents associated with a given user ID in a paginated manner.
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of chat documents to retrieve per page
 * @returns {Promise<IChat[]>} An array of chat documents associated with the user
 * @throws {ZodError} If user ID is invalid or missing
 * @throws {ZodError} If page or limit is invalid or missing
 * @throws {ZodError} If page or limit is not a positive integer
 */
export const getChatByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const validated = getChatByUserPageSchema.parse({ userId, page, limit });

  const chat = await getChatByUserPaginated(
    validated.userId,
    validated.page,
    validated.limit,
  );
  return chat;
};
