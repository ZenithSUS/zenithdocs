import client from "../index.js";
import { Response } from "express";
import { generateEmbedding } from "./embedding.service.js";
import {
  createGlobalMessage,
  getRecentGlobalMessagesByChatId,
  getTotalGlobalMessagesByChatAndUserId,
} from "../../../repositories/global-message.repository.js";
import { initGlobalChatService } from "../../../services/global-chat.service.js";
import summarizeOldMessages from "../utils/summarize-message.js";
import { updateGlobalChatSummary } from "../../../repositories/global-chat.repository.js";
import generateSearchQueries from "../utils/generate-search-queries.js";
import calculateGlobalConfidenceScore from "../utils/global-confidence-score.js";
import { IDocumentChunkOutput } from "../../../models/document-chunk.model.js";
import { globalChatUserSchema } from "../../../schemas/global-chat.schema.js";
import isZenithDocsQuestion from "../../../utils/zenithdocs-question.js";
import redis from "../../../config/redis.js";
import { incrementAIMessagesUsage } from "../../../repositories/usage.repository.js";
import { getDashboardOverviewService } from "../../../services/dashboard.service.js";
import { getUserByIdService } from "../../../services/user.service.js";
import { getSystemPrompt } from "../prompts/global-chat-prompt.js";
import CacheKeys from "../../../config/cache-keys.js";
import retrieveGlobalChunks from "../utils/retrieve-global-chunks.js";

interface streamDocumentUserChatPayload {
  userId: string;
  question: string;
  res: Response;
}

const MAX_HISTORY_LENGTH = 10;

export const streamDocumentUserChat = async ({
  userId,
  question,
  res,
}: streamDocumentUserChatPayload) => {
  const validated = globalChatUserSchema.parse({ userId, question });

  // ─── SSE headers ─────────────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // ─── Chat history ─────────────────────────────────────────────────────────────
  const globalChat = await initGlobalChatService(validated.userId);

  const totalGlobalMessages = await getTotalGlobalMessagesByChatAndUserId(
    globalChat._id.toString(),
    validated.userId,
  );
  const oldGlobalMessages = await getRecentGlobalMessagesByChatId(
    globalChat._id.toString(),
  );

  let globalSummary = globalChat.summary;

  if (totalGlobalMessages > MAX_HISTORY_LENGTH) {
    globalSummary = (await summarizeOldMessages(oldGlobalMessages)).toString();
    await updateGlobalChatSummary(validated.userId, globalSummary);
  }

  const recentHistory = oldGlobalMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // ─── User info + dashboard (cached) ──────────────────────────────────────────
  const userCacheKey = CacheKeys.userInfo(validated.userId);
  const dashboardCacheKey = CacheKeys.dashboardStable(validated.userId);

  const [cachedUser, cachedDashboard] = await Promise.all([
    redis.get(userCacheKey),
    redis.get(dashboardCacheKey),
  ]);

  const [dashboardOverview, userInfo] = await Promise.all([
    cachedDashboard
      ? JSON.parse(cachedDashboard)
      : getDashboardOverviewService(validated.userId),
    cachedUser ? JSON.parse(cachedUser) : getUserByIdService(validated.userId),
  ]);

  if (!cachedUser)
    await redis.setex(userCacheKey, 300, JSON.stringify(userInfo));
  if (!cachedDashboard)
    await redis.setex(dashboardCacheKey, 60, JSON.stringify(dashboardOverview));

  // ─── Abort handling ───────────────────────────────────────────────────────────
  const abortController = new AbortController();
  let stream: Awaited<ReturnType<typeof client.chat.stream>> | null = null;
  let aborted = false;

  res.on("close", () => {
    aborted = true;
    abortController.abort();
  });

  // ─── Question embedding (cached) ─────────────────────────────────────────────
  const embeddingCacheKey = CacheKeys.questionEmbedding(validated.question);
  const cachedEmbedding = await redis.get(embeddingCacheKey);

  const questionEmbedding = cachedEmbedding
    ? JSON.parse(cachedEmbedding)
    : await generateEmbedding(validated.question);

  if (!cachedEmbedding)
    await redis.setex(
      embeddingCacheKey,
      3600,
      JSON.stringify(questionEmbedding),
    );

  // ─── Generate search queries ─────────────────────────────────────────────────
  const [isAppQuestion, queries] = await Promise.all([
    Promise.resolve(isZenithDocsQuestion(validated.question)),
    (async () => {
      const generated = await generateSearchQueries(validated.question);
      return [question, ...generated.slice(0, 2)];
    })(),
  ]);

  if (aborted) {
    res.end();
    return;
  }

  const documentChunks = await retrieveGlobalChunks(
    queries,
    validated.userId,
    () => aborted,
  );

  if (aborted) {
    res.end();
    return;
  }

  let filteredChunks: IDocumentChunkOutput[] = [];
  let context: string;
  let confidenceScore: number;

  if (documentChunks.length > 0) {
    // Real document context always takes priority
    filteredChunks = documentChunks;
    confidenceScore = calculateGlobalConfidenceScore(filteredChunks);
    context = filteredChunks
      .map(
        (chunk, i) => `
Document ${i + 1}
Source: ${chunk.documentName}

${chunk.text}`,
      )
      .join("\n\n---\n\n");
  } else if (isAppQuestion) {
    context = "ZENITHDOCS_GENERAL_QUESTION";
    confidenceScore = 1.0;
  } else {
    context = "NO_RELEVANT_DOCUMENT_CONTEXT";
    confidenceScore = 0;
  }

  const systemPrompt = getSystemPrompt(
    context,
    globalSummary,
    userInfo,
    dashboardOverview,
    validated.question,
  );

  stream = await client.chat.stream(
    {
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: systemPrompt },
        ...recentHistory,
        { role: "user", content: validated.question },
      ],
      stream: true,
      temperature: 0.4,
      topP: 1,
      maxTokens: 2000,
    },
    {
      signal: abortController.signal,
    },
  );

  const relatedDocumentIds = new Set(
    filteredChunks.map((chunk) => chunk.documentId.toString()),
  );

  let fullResponse = "";
  let finalUsage = null;

  res.write(
    `data: [CONFIDENCE]:${JSON.stringify({ score: confidenceScore })}\n\n`,
  );

  try {
    for await (const chunk of stream) {
      if (aborted) break;

      const token = chunk.data.choices[0].delta.content;

      if (chunk.data?.usage) {
        finalUsage = chunk.data.usage;
      }

      if (token) {
        fullResponse += token;
        const encoded = token.toString().replace(/\n/g, "\\n");
        res.write(`data: ${encoded}\n\n`);
      }
    }
  } catch (error) {
    const err = error as Error;
    if (
      err.name === "AbortError" ||
      err.message?.includes("aborted") ||
      err.message?.includes("cancelled")
    ) {
      aborted = true;
    } else {
      res.end();
      throw error;
    }
  }

  if (!aborted) {
    res.write("data: [DONE]\n\n");
    res.end();
  }

  if (!aborted && fullResponse) {
    const tokenUsed = finalUsage?.totalTokens || 0;
    await incrementAIMessagesUsage(validated.userId, tokenUsed);

    await createGlobalMessage({
      role: "user",
      content: validated.question,
      userId: validated.userId,
      chatId: globalChat._id.toString(),
      relatedDocumentIds: Array.from(relatedDocumentIds),
      embedding: questionEmbedding,
    });

    await createGlobalMessage({
      role: "assistant",
      content: fullResponse,
      userId: validated.userId,
      chatId: globalChat._id.toString(),
      relatedDocumentIds: Array.from(relatedDocumentIds),
      confidenceScore: confidenceScore,
    });
  }

  return fullResponse;
};
