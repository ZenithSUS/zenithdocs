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

interface streamDocumentUserChatPayload {
  userId: string;
  question: string;
  res: Response;
}

const getSystemPrompt = (context: string, summary: string) => {
  return `You are ZenithDocs AI, the assistant inside the ZenithDocs platform.

About ZenithDocs:
ZenithDocs is an AI-powered document management and knowledge assistant created by ZenithSUS.

It helps users:
- Upload and organize documents
- Search information inside documents using AI
- Ask questions about their documents
- Generate summaries and insights from uploaded files
- Manage knowledge efficiently

Allowed Document Types:
- PDF
- Word
- TXT
- CSV

Maximum Document Size: 10MB

Summary Types:
- Short Summary
- Bullet Point Summary
- Detailed Summary
- Executive Summary

Your Role:
You answer user questions using information from their uploaded documents.

The provided context contains excerpts from uploaded documents. 
Each section may come from different files.

${summary ? "\nPrevious Conversation Summary:\n" + summary + "\n" : ""}

Rules:
- Use the provided document context as the PRIMARY source of truth.
- Do NOT rely on your general knowledge unless the question is about ZenithDocs itself.
- If the answer is not present in the context, say:

"The uploaded documents do not contain information about this question."

- If the question is unrelated to both the context and ZenithDocs, say:

"I can't answer that because it is not related to the documents or ZenithDocs."

- Never guess.
- Never invent information.

Special Case:
If the context is "NO_RELEVANT_DOCUMENT_CONTEXT", respond:

"The uploaded documents do not contain information about this question."

Formatting Rules:
- Use markdown formatting
- Use **bold** for key terms
- Use bullet points or numbered lists for multiple items
- Use headers (##) for longer explanations
- Keep technical terms in \`backticks\`

When possible:
- Mention which document the information came from.

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

  const MAX_PER_DOC = 3;
  const docCount = new Map();

  const cacheKey = `global-embedding-${validated.question}`;
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
    context = "NO_RELEVANT_DOCUMENT_CONTEXT";
    confidenceScore = 1.0;
  } else {
    const queries = [
      question,
      ...(await generateSearchQueries(validated.question)).slice(0, 2),
    ];

    const allChunks = (
      await Promise.all(
        queries.map(async (q) => {
          const embedding = await generateEmbedding(q);
          return getDocumentUserSimilarityScore(embedding, validated.userId);
        }),
      )
    ).flat();

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

  const systemPrompt = getSystemPrompt(context, globalSummary);

  const stream = await client.chat.stream({
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
  });

  const relatedDocumentIds = new Set(
    filteredChunks.map((chunk) => chunk.documentId.toString()),
  );

  await createGlobalMessage({
    role: "user",
    content: validated.question,
    userId: validated.userId,
    chatId: globalChat._id.toString(),
    relatedDocumentIds: Array.from(relatedDocumentIds),
    embedding: questionEmbedding,
  });

  let fullResponse = "";

  // Write the initial confidence score
  res.write(
    `data: [CONFIDENCE]:${JSON.stringify({ score: confidenceScore })}\n\n`,
  );

  for await (const chunk of stream) {
    const token = chunk.data.choices[0].delta.content;

    if (token) {
      fullResponse += token;

      const encoded = token.toString().replace(/\n/g, "\\n");
      res.write(`data: ${encoded}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();

  await createGlobalMessage({
    role: "assistant",
    content: fullResponse,
    userId: validated.userId,
    chatId: globalChat._id.toString(),
    relatedDocumentIds: Array.from(relatedDocumentIds),
    confidenceScore: confidenceScore,
  });

  return fullResponse;
};
