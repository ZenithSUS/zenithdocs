import mongoose from "mongoose";
import DocumentChunk, {
  IDocumentChunkInput,
  IDocumentChunkOutput,
} from "../models/DocumentChunk.js";
import colors from "../utils/log-colors.js";

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
 * Searches for similar document chunks based on the given query embedding and document ID.
 * It returns up to 20 similar document chunks with the highest similarity score.
 * @param {EmbeddingResponse} queryEmbedding - The query embedding to search for similar document chunks.
 * @param {string} documentId - The ID of the document to search for similar document chunks.
 * @returns {Promise<IDocumentChunk[]>} An array of up to 20 similar document chunks with the highest similarity score.
 */
export const getSimilarityScore = async (
  queryEmbedding: number[],
  documentId: string,
  minScore = 0.7,
) => {
  try {
    if (!queryEmbedding?.length) return [];

    const results = await DocumentChunk.aggregate<IDocumentChunkOutput>([
      {
        $vectorSearch: {
          index: "embedding",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 300,
          limit: 20,
          filter: {
            documentId: { $eq: new mongoose.Types.ObjectId(documentId) },
          },
        },
      },
      {
        $project: {
          text: 1,
          chunkIndex: 1,
          documentId: 1,
          documentName: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
      { $match: { score: { $gte: minScore } } },
      { $sort: { score: -1 } },
    ]);

    return results;
  } catch (err) {
    const error = err as Error;
    console.log("=".repeat(50));
    console.log(`${colors.red}Error: ${colors.reset}${error.message}`);
    console.log("=".repeat(50) + "\n");
    return [];
  }
};

/**
 * Searches for similar document chunks based on the given query embedding and user ID.
 * It returns up to 20 similar document chunks with the highest similarity score.
 * @param {number[]} queryEmbedding - The query embedding to search for similar document chunks.
 * @param {string} userId - The ID of the user to search for similar document chunks.
 * @returns {Promise<IDocumentChunk[]>} An array of up to 20 similar document chunks with the highest similarity score.
 */
export const getDocumentUserSimilarityScore = async (
  queryEmbedding: number[],
  userId: string,
) => {
  try {
    if (!queryEmbedding.length) return [];

    const results = await DocumentChunk.aggregate<IDocumentChunkOutput>([
      {
        $vectorSearch: {
          index: "embedding",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 400,
          limit: 40,
          filter: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
      },
      {
        $project: {
          text: 1,
          chunkIndex: 1,
          documentId: 1,
          documentName: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return results;
  } catch (error) {
    const err = error as Error;
    console.log("=".repeat(50));
    console.error(
      `${colors.red}Chunk Similarity Error: ${colors.reset}${err.message}`,
    );
    console.log("=".repeat(50) + "\n");
    return [];
  }
};

/**
 * Retrieves up to a given limit of similar document chunks from a given document ID,
 * filtered by a minimum similarity score.
 * @param {number[]} queryEmbedding - The query embedding to search for similar document chunks.
 * @param {string} documentId - The ID of the document to search for similar document chunks.
 * @param {number} [minScore=0.6] - The minimum similarity score required for a document chunk to be considered similar.
 * @param {number} [limit=5] - The maximum number of similar document chunks to return.
 * @returns {Promise<IDocumentChunk[]>} An array of up to limit similar document chunks with the highest similarity score, filtered by minScore.
 */
export const getSimilaritySummaryScore = async (
  queryEmbedding: number[],
  documentId: string,
  minScore = 0.6,
  limit = 5,
) => {
  const results = await DocumentChunk.aggregate<IDocumentChunkOutput>([
    {
      $vectorSearch: {
        index: "embedding",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 150,
        limit: limit * 2,
        filter: {
          documentId: { $eq: new mongoose.Types.ObjectId(documentId) },
        },
      },
    },
    {
      $project: {
        text: 1,
        chunkIndex: 1,
        documentId: 1,
        documentName: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    { $match: { score: { $gte: minScore } } },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);

  return results;
};

/**
 * Retrieves document chunks by document ID
 * @param {string} documentId - ID of the document
 * @returns {Promise<IDocumentChunk[]>} Document chunks
 */
export const getDocumentChunksByDocumentId = async (documentId: string) => {
  const documentChunks = await DocumentChunk.find({ documentId })
    .sort({ chunkIndex: 1 })
    .select("_id text chunkIndex")
    .lean();
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
