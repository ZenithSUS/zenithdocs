import { Response } from "express";
import client from "../index.js";
import { generateEmbedding } from "./embedding.service.js";
import { getDocumentUserSimilarityScore } from "../../../repositories/document-chunk.repository.js";
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
import {
  getDashboardOverviewService,
  IDashboardOverview,
} from "../../../services/dashboard.service.js";
import { getUserByIdService } from "../../../services/user.service.js";
import { UserWithLimits } from "../../../models/user.model.js";
import CacheKeys from "../../../config/cache-keys.js";

interface streamDocumentUserChatPayload {
  userId: string;
  question: string;
  res: Response;
}

const getSystemPrompt = (
  context: string,
  summary: string,
  userInfo: UserWithLimits,
  dashboardOverview: IDashboardOverview,
) => {
  return `You are ZenithDocs AI, the assistant inside the ZenithDocs platform.

About ZenithDocs:
ZenithDocs is an AI-powered document management and knowledge assistant created by ZenithSUS.

It helps users:
- Upload and organize documents
- Search information inside documents using AI
- Ask questions about their documents
- Generate summaries and insights from uploaded files
- Manage knowledge efficiently
- Enhance productivity and knowledge retention
- Create Learning Sets for self-study and revision

Allowed Document Types:
- PDF
- Docx
- Word
- TXT
- Excel (XLSX)

Maximum Document Size: 10MB

Summary Types:
- Short Summary
- Bullet Point Summary
- Detailed Summary
- Executive Summary

Your Role:
You answer user questions using information from their uploaded documents.

${summary ? "\nPrevious Conversation Summary:\n" + summary + "\n" : ""}

Context Interpretation:
The "Context" section at the bottom will contain one of three things:
- Exactly "ZENITHDOCS_GENERAL_QUESTION": the user is asking about ZenithDocs itself.
  Answer using your knowledge of the platform described above. Begin your response with:
  "ZenithDocs - AI-Powered Document Manager - General Question:"
  Do NOT say the documents don't contain this info.
- Exactly "NO_RELEVANT_DOCUMENT_CONTEXT": no matching documents were found.
  Respond: "The uploaded documents do not contain information about this question."
- Actual document excerpts: use these as your PRIMARY source of truth.
  Each section may come from different files.

Rules:
- Use document excerpts as the PRIMARY source of truth when present.
- Do NOT rely on general knowledge unless the context is "ZENITHDOCS_GENERAL_QUESTION".
- If the answer is not in the document excerpts, say:
  "The uploaded documents do not contain information about this question."
- If the question is unrelated to both the documents AND ZenithDocs, say:
  "I can't answer that because it is not related to the documents or ZenithDocs."
- Never guess.
- Never invent information.

Formatting Rules:
- Use markdown formatting
- Use **bold** for key terms
- Use bullet points or numbered lists for multiple items
- Use headers (##) for longer explanations
- Keep technical terms in \`backticks\`
- When possible, mention which document the information came from.

User: ${userInfo.email}
Plan: ${userInfo.plan}

User Limits:
- Messages Per Day: ${userInfo.messagesPerDay}
- Document Limit: ${userInfo.documentLimit}
- Storage Limit: ${userInfo.storageLimit}MB

User Dashboard Overview (use only if the user asks about their usage, document count, storage, or activity):
${JSON.stringify(dashboardOverview)}

Context:
${context}`;
};

const MAX_HISTORY_LENGTH = 10;

export const streamDocumentUserChat = async ({
  userId,
  question,
  res,
}: streamDocumentUserChatPayload) => {
  const validated = globalChatUserSchema.parse({ userId, question });

  // ─── Set response headers to enable SSE ────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let globalChat = await initGlobalChatService(validated.userId);

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

  if (!cachedUser) {
    await redis.setex(userCacheKey, 300, JSON.stringify(userInfo)); // 5 min TTL
  }
  if (!cachedDashboard) {
    await redis.setex(dashboardCacheKey, 60, JSON.stringify(dashboardOverview)); // 1 min TTL
  }

  const abortController = new AbortController();
  let stream: Awaited<ReturnType<typeof client.chat.stream>> | null = null;
  let aborted = false;

  res.on("close", () => {
    aborted = true;
    abortController.abort();
  });

  const MAX_PER_DOC = 3;
  const docCount = new Map();

  const cacheKey = CacheKeys.questionEmbedding(validated.question);
  const cachedEmbedding = await redis.get(cacheKey);

  const questionEmbedding = cachedEmbedding
    ? JSON.parse(cachedEmbedding)
    : await generateEmbedding(validated.question);

  if (!cachedEmbedding) {
    await redis.setex(cacheKey, 3600, JSON.stringify(questionEmbedding));
  }

  const isAppQuestion = isZenithDocsQuestion(validated.question);

  let filteredChunks: IDocumentChunkOutput[] = [];
  let context: string;
  let confidenceScore: number;

  if (isAppQuestion) {
    context = "ZENITHDOCS_GENERAL_QUESTION";
    confidenceScore = 1.0;
  } else {
    const queries = [
      question,
      ...(await generateSearchQueries(validated.question)).slice(0, 2),
    ];

    if (aborted) return;

    const allChunks = (
      await Promise.all(
        queries.map(async (q) => {
          const embedding = await generateEmbedding(q);
          return getDocumentUserSimilarityScore(embedding, validated.userId);
        }),
      )
    ).flat();

    if (aborted) return;

    const uniqueChunks = Array.from(
      new Map(allChunks.map((c) => [c._id.toString(), c])).values(),
    );

    const filteredChunks = uniqueChunks
      .filter((c) => c.score >= 0.82)
      .sort((a, b) => b.score - a.score)
      .filter((chunk) => {
        const count = docCount.get(chunk.documentId.toString()) || 0;
        if (count >= MAX_PER_DOC) return false;
        docCount.set(chunk.documentId.toString(), count + 1);
        return true;
      })
      .slice(0, 5);

    confidenceScore = calculateGlobalConfidenceScore(filteredChunks);

    context =
      filteredChunks.length > 0
        ? filteredChunks
            .map(
              (chunk, i) => `
  Document ${i + 1}
  Source: ${chunk.documentName}
  
  ${chunk.text}`,
            )
            .join("\n\n---\n\n")
        : "NO_RELEVANT_DOCUMENT_CONTEXT";
  }

  const systemPrompt = getSystemPrompt(
    context,
    globalSummary,
    userInfo,
    dashboardOverview,
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

  // Write the initial confidence score
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
