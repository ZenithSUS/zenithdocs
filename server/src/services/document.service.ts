import { IDocument } from "../models/Document.js";
import {
  createDocument,
  deleteDocumentById,
  getAllDocuments,
  getDocumentById,
  getDocumentsByUserPaginated,
  updateDocument,
} from "../repositories/document.repository.js";
import AppError from "../utils/app-error.js";

/**
 * Creates a new document
 * @param data - Document data
 * @returns Created document
 */
export const createDocumentService = async (data: Partial<IDocument>) => {
  if (!data || typeof data !== "object")
    throw new AppError("Data is required", 400);

  const document = await createDocument(data);
  return document;
};

/**
 * Gets All Documents
 * @returns All Documents
 */
export const getAllDocumentsService = async () => {
  const documents = await getAllDocuments();
  return documents;
};

/**
 * Get Documents by pagination
 * @param userId - User ID
 * @param page - Page
 * @param limit - Limit to be fetched
 * @returns
 */
export const getDocumentsByUserPaginatedService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  if (!userId) throw new AppError("User ID is required", 400);

  if (!page || !limit) throw new AppError("Page and limit are required", 400);

  const documents = await getDocumentsByUserPaginated(userId, page, limit);
  return documents;
};

/**
 * Gets Document By ID
 * @param id - Document ID
 * @returns Document By ID
 */
export const getDocumentByIdService = async (id: string) => {
  const document = await getDocumentById(id);

  if (!document) throw new Error("Document not found");

  return document;
};

/**
 * Updates a document by ID
 * @param id - Document ID
 * @param data - Data to update
 * @returns Updated document
 */
export const updateDocumentService = async (
  id: string,
  data: Partial<IDocument>,
) => {
  if (!id) throw new AppError("Document ID is required", 400);

  if (!data || typeof data !== "object")
    throw new AppError("Data is required", 400);

  const document = await updateDocument(id, data);
  return document;
};

/**
 * Deletes a document by ID
 * @param id - Document ID
 * @returns Deleted document
 */
export const deleteDocumentByIdService = async (id: string) => {
  if (!id) throw new AppError("Document ID is required", 400);

  const document = await deleteDocumentById(id);

  if (!document) throw new Error("Document not found");

  return document;
};
