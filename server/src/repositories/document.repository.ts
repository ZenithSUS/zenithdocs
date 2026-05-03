import { Types } from "mongoose";
import Document, {
  IDocument,
  IDocumentInput,
} from "../models/document.model.js";
import Chat from "../models/chat.model.js";

/**
 * Creates a new document in the database
 * @param data - The data to create the document with
 * @returns The created document
 */
export const createDocument = async (data: Partial<IDocumentInput>) => {
  const createdDocument = await Document.create(data);

  const document = await Document.findById(createdDocument._id)
    .select("-rawText")
    .populate({ path: "folder", select: "_id name" })
    .lean<IDocument>();

  if (!document) {
    throw new Error(
      `Document not found after creation: ${createdDocument._id}`,
    );
  }

  return document;
};

/**
 * Retrieves all documents from the database
 * Populates the user field with the email of the user
 * Returns an array of documents
 */
export const getAllDocuments = async () => {
  return await Document.find()
    .populate({
      path: "user",
      select: "_id email",
    })
    .populate({
      path: "folder",
      select: "_id name",
    })
    .lean();
};

/**
 * Get a document by ID
 * @param id - Document ID
 * @returns Document if found, null otherwise
 * @throws MongooseError if document ID is invalid
 */
export const getDocumentById = async (id: string) => {
  return await Document.findById(id)
    .populate({
      path: "user",
      select: "_id email",
    })
    .populate({
      path: "folder",
      select: "_id name",
    })
    .lean();
};

/**
 * Retrieves documents belonging to a user in a paginated manner
 * @param userId - User ID
 * @param page - Page number to retrieve
 * @param limit - Number of documents to retrieve per page
 * @returns An object containing the documents and the count of documents belonging to the user
 * @throws {null} If the user ID is invalid
 */
export const getDocumentsByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const documents = await Document.aggregate([
    {
      $match: { user: new Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "documentshares",
        let: { documentId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$documentId", "$$documentId"] },
                  { $eq: ["$ownerId", new Types.ObjectId(userId)] },
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              ownerId: 1,
            },
          },
        ],
        as: "shared",
      },
    },
    {
      $lookup: {
        from: "folders",
        localField: "folder",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
        as: "folder",
      },
    },
    {
      $unwind: {
        path: "$folder",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: offset,
    },
    {
      $limit: limit,
    },
    {
      $addFields: {
        isShared: {
          $cond: {
            if: { $gt: [{ $size: "$shared" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $unset: ["rawText", "shared"],
    },
  ]);

  const total = await Document.countDocuments({ user: userId });

  return {
    documents,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves the total number of documents belonging to a user
 * @param {string} userId - User ID
 * @returns The total number of documents belonging to the user if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getTotalDocumentsByUser = async (userId: string) => {
  return await Document.countDocuments({ user: userId });
};

/**
 * Retrieves the total number of documents belonging to a user with a specific status
 * @param {string} userId - User ID
 * @param {string} status - Status of the documents to retrieve
 * @returns The total number of documents belonging to the user with the specified status if found, null otherwise
 * @throws {null} If the user ID is invalid
 */
export const getTotalStatusDocumentsByUser = async (
  userId: string,
  status: "uploaded" | "processing" | "completed" | "failed",
) => {
  return await Document.countDocuments({ user: userId, status: status });
};

/**
 * Retrieves documents belonging to a user in a paginated manner along with their associated chats.
 * @param {string} userId - User ID
 * @param {number} page - Page number to retrieve
 * @param {number} limit - Number of documents to retrieve per page
 * @returns {Promise<{ documents: IWithChat[], pagination: { page: number, limit: number, total: number, totalPages: number } }>} An object containing the documents with their associated chats and the pagination information
 * @throws {null} If the user ID is invalid
 */
export const getDocumentsByUserWithChatsPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const [documents, total] = await Promise.all([
    Document.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-rawText")
      .skip(offset)
      .limit(limit)
      .lean(),
    Document.countDocuments({ user: userId }),
  ]);

  const documentIds = documents.map((doc) => doc._id);

  const chatAggregation = await Chat.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        documentId: { $in: documentIds },
      },
    },
    // Get the last message for each chat
    {
      $lookup: {
        from: "messages", // collection name
        let: { chatId: "$_id" }, // chatId from messages
        pipeline: [
          { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, content: 1, role: 1, createdAt: 1 } },
        ],
        as: "lastMessage",
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "chatId",
        as: "messages",
      },
    },
    {
      $project: {
        documentId: 1,
        summary: 1,
        createdAt: 1,
        updatedAt: 1,
        messageCount: { $size: "$messages" },
        lastMessage: {
          $cond: {
            if: { $gt: [{ $size: "$lastMessage" }, 0] },
            then: {
              content: { $first: "$lastMessage.content" },
              role: { $first: "$lastMessage.role" },
              createdAt: { $first: "$lastMessage.createdAt" },
            },
            else: null,
          },
        },
      },
    },
  ]);

  // Map by documentId O(1) lookup
  const chatMap = new Map(
    chatAggregation.map((chat) => [chat.documentId.toString(), chat]),
  );

  const documentsWithChats = documents.map((doc) => ({
    ...doc,
    chat: chatMap.get(doc._id.toString()) || null,
  }));

  return {
    documents: documentsWithChats,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Retrieves the 5 most recent documents belonging to a user
 * @param {string} userId - User ID
 * @returns The 5 most recent documents belonging to the user if found, empty array otherwise
 * @throws {null} If the user ID is invalid
 */
export const getRecentDocumentsByUser = async (userId: string) => {
  return await Document.find({ user: userId })
    .select("-rawText")
    .populate({
      path: "folder",
      select: "_id name",
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
};

/**
 * Retrieves the 5 most recent documents belonging to a user that are not in any folder
 * @param {string} userId - User ID
 * @returns The 5 most recent documents belonging to the user that are not in any folder if found, empty array otherwise
 * @throws {null} If the user ID is invalid
 */
export const getUnifiedDocumentsByUser = async (userId: string) => {
  const [documents, total] = await Promise.all([
    Document.find({
      user: userId,
      $or: [{ folder: { $exists: false } }, { folder: null }],
    })
      .select("-rawText")
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "folder",
        select: "_id name",
      })
      .lean(),
    Document.countDocuments({
      user: userId,
      $or: [{ folder: { $exists: false } }, { folder: null }],
    }),
  ]);

  return {
    documents,
    total,
  };
};

/**
 * Update a document by ID
 * @param {string} id - Document ID
 * @param {Partial<IDocumentInput>} data - Data to update
 * @returns Updated document if found, null otherwise
 */
export const updateDocument = async (
  id: string,
  data: Partial<IDocumentInput>,
) => {
  return await Document.findByIdAndUpdate(id, data, { returnDocument: "after" })
    .select("-rawText")
    .populate({
      path: "user",
      select: "_id email",
    })
    .populate({
      path: "folder",
      select: "_id name",
    })
    .lean();
};

/**
 * Delete a document by ID
 * @param {string} id - Document ID
 * @returns Deleted document if found, null otherwise
 * @throws {null} If the document ID is invalid
 */
export const deleteDocumentById = async (id: string) => {
  return await Document.findByIdAndDelete(id);
};
