import DocumentChunk, {
  IDocumentChunkInput,
} from "../models/Document_Chunk.js";

/**
 * Creates multiple document chunks in the database.
 * @param {Partial<IDocumentChunkInput[]>} data - An array of document chunk objects to create.
 * @returns {Promise<IDocumentChunk[]>} An array of the created document chunks.
 */
export const createManyDocumentChunks = async (
  data: Partial<IDocumentChunkInput[]>,
) => {
  const documentChunks = await DocumentChunk.insertMany(data);
  return documentChunks;
};

/**
 * Retrieves document chunks by document ID
 * @param {string} documentId - ID of the document
 * @returns {Promise<IDocumentChunk[]>} Document chunks
 */
export const getDocumentChunksByDocumentId = async (documentId: string) => {
  const documentChunks = await DocumentChunk.find({ documentId });
  return documentChunks;
};

/**
 * Deletes all document chunks associated with a given document ID.
 * @param {string} documentId - ID of the document
 * @returns {Promise<IDocumentChunk[]>} An array of the deleted document chunks
 */
export const deleteDocumentChunksByDocumentId = async (documentId: string) => {
  const documentChunks = await DocumentChunk.deleteMany({ documentId });
  return documentChunks;
};

/**
 * Deletes all document chunks associated with a given user ID.
 * @param {string} userId - ID of the user
 * @returns {Promise<IDocumentChunk[]>} An array of the deleted document chunks
 */
export const deleteDocumentChunksByUserId = async (userId: string) => {
  const documentChunks = await DocumentChunk.deleteMany({ userId });
  return documentChunks;
};

/**
 * Deletes all document chunks associated with a given user ID and document ID.
 * @param {string} userId - ID of the user
 * @param {string} documentId - ID of the document
 * @returns {Promise<IDocumentChunk[]>} An array of the deleted document chunks
 */
export const deleteDocumentChunksByUserIdAndDocumentId = async (
  userId: string,
  documentId: string,
) => {
  const documentChunks = await DocumentChunk.deleteMany({ userId, documentId });
  return documentChunks;
};

/**
 * Deletes all document chunks associated with a given user ID and a list of document IDs.
 * @param {string} userId - ID of the user
 * @param {string[]} documentIds - List of IDs of the documents to delete
 * @returns {Promise<IDocumentChunk[]>} An array of the deleted document chunks
 */
export const deleteDocumentChunksByUserIdAndDocumentIds = async (
  userId: string,
  documentIds: string[],
) => {
  const documentChunks = await DocumentChunk.deleteMany({
    userId,
    documentId: { $in: documentIds },
  });
  return documentChunks;
};

/**
 * Deletes all document chunks associated with a given user ID and chunk index.
 * @param {string} userId - ID of the user
 * @param {number} chunkIndex - Index of the chunk to delete
 * @returns {Promise<IDocumentChunk[]>} An array of the deleted document chunks
 */
export const deleteDocumentChunksByUserIdAndChunkIndex = async (
  userId: string,
  chunkIndex: number,
) => {
  const documentChunks = await DocumentChunk.deleteMany({ userId, chunkIndex });
  return documentChunks;
};
