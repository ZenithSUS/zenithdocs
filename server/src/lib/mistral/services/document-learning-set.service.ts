import { IDocumentChunk } from "../../../models/document-chunk.model.js";
import {
  ILearningItem,
  ILearningSet,
} from "../../../models/learning-set.model.js";
import { getDocumentChunksByDocumentId } from "../../../repositories/document-chunk.repository.js";
import { getDocumentById } from "../../../repositories/document.repository.js";
import { incrementOnlyAIRequests } from "../../../repositories/usage.repository.js";
import AppError from "../../../utils/app-error.js";
import colors from "../../../utils/log-colors.js";
import client from "../index.js";
import { SYSTEM_PROMPT } from "../prompts/learning-sets-prompt.js";

export type LearningItemType =
  | "general"
  | "mcq"
  | "tf"
  | "identification"
  | "flashcard";

export interface GenerateLearningSetPayload {
  type: "quiz" | "reviewer" | "flashcard";
  itemType: LearningItemType;
  difficulty: "easy" | "medium" | "hard";
  documentId: string;
  ownerId: string;
  role: "user" | "admin";
}

const BATCH_SIZE = 10;

const callModel = async (
  chunks: IDocumentChunk[],
  type: "quiz" | "reviewer" | "flashcard",
  itemType: LearningItemType,
  difficulty: "easy" | "medium" | "hard",
  documentId: string,
  ownerId: string,
): Promise<ILearningSet & { tokenUsed: number }> => {
  const userMessage = JSON.stringify({
    documentId,
    ownerId,
    type,
    difficulty,
    chunks: chunks.map((c) => ({
      hash: c._id.toString(),
      content: c.text,
    })),
  });

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT(itemType) },
      { role: "user", content: userMessage },
    ],
    responseFormat: { type: "json_object" },
    temperature: 0.4,
  });

  const tokenUsed = response.usage?.totalTokens ?? 0;

  const raw = response.choices?.[0]?.message?.content;
  if (!raw) {
    throw new AppError("No response from model", 500);
  }

  const parsed = JSON.parse(raw.toString());
  return {
    ...parsed,
    tokenUsed,
  };
};

export const generateLearningSets = async ({
  type,
  difficulty,
  itemType,
  documentId,
  ownerId,
  role,
}: GenerateLearningSetPayload) => {
  const document = await getDocumentById(documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.user._id.toString() !== ownerId && role !== "admin") {
    throw new AppError("You are not the owner of this document", 403);
  }

  const chunks = await getDocumentChunksByDocumentId(documentId);

  if (!chunks.length) {
    throw new AppError("No document chunks found", 400);
  }

  const batches: IDocumentChunk[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    batches.push(chunks.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.allSettled(
    batches.map((batch) =>
      callModel(batch, type, itemType, difficulty, documentId, ownerId),
    ),
  );

  const mergedItems: ILearningItem[] = [];
  const mergedHashes: string[] = [];

  let tokenUsed = 0;

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      mergedItems.push(...(result.value.items ?? []));
      mergedHashes.push(...(result.value.chunkHashes ?? []));
      tokenUsed += result.value.tokenUsed;
    } else {
      console.log("=".repeat(50));
      console.log(
        `${colors.red}Error generating learning set for batch ${index}: ${colors.reset}`,
        result.reason,
      );
      console.log("=".repeat(50) + "\n");
    }
  });

  if (!mergedItems.length) {
    throw new AppError("All batches failed. No items generated.", 500);
  }

  await incrementOnlyAIRequests(ownerId, tokenUsed);

  return {
    documentId,
    ownerId,
    type,
    difficulty,
    items: mergedItems,
    chunkHashes: mergedHashes,
    source: "ai" as const,
  };
};
