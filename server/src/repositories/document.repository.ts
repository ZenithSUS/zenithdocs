import mongoose from "mongoose";
import Document, { IDocument } from "../models/Document.js";

/**
 * Creates a new document with the given data
 * @param data - Partial document data
 * @returns The created document
 * @throws MongooseError if document data is invalid
 */
export const createDocument = async (data: Partial<IDocument>) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Document data is required");
  }

  const document = new Document(data);
  return await document.save();
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
    .lean();
};

/**
 * Get a document by ID
 * @param id - Document ID
 * @returns Document if found, null otherwise
 * @throws MongooseError if document ID is invalid
 */
export const getDocumentById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Document.findById(id)
    .populate({
      path: "user",
      select: "_id email",
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
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }
  const offset = (page - 1) * limit;

  const documents = await Document.find({ user: userId })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id email",
    })
    .lean();

  const total = await Document.countDocuments({ user: userId });

  return {
    documents,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Update a document by ID
 * @param {string} id - Document ID
 * @param {Partial<IDocument>} data - Data to update
 * @returns Updated document if found, null otherwise
 */
export const updateDocument = async (id: string, data: Partial<IDocument>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Document.findByIdAndUpdate(id, data, { returnDocument: "after" })
    .populate({
      path: "user",
      select: "_id email",
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Document.findByIdAndDelete(id);
};
