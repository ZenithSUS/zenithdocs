import { Response } from "express";
import client from "../index.js";
import AppError from "../../../utils/app-error.js";
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

You assist users by answering questions based on their uploaded documents.

${summary ? "\nPrevious Conversation Summary:\n" + summary + "\n" : ""}

Rules:
- Answer questions using ONLY the provided document context when the question is about document content.
- If the user asks about ZenithDocs or the system itself, you may answer using the ZenithDocs description above.
- If the question is unrelated to both the context and ZenithDocs, say:
  "I can't answer that because it is not related to the documents or ZenithDocs."

Formatting Rules:
- Use markdown formatting
- Use **bold** for key terms
- Use bullet points or numbered lists for multiple items
- Use headers (##) for longer explanations
- Keep technical terms in \`backticks\`

Context:
${context}`;
};

const MAX_HISTORY_LENGTH = 10;

export const streamDocumentUserChat = async ({
  userId,
  question,
  res,
}: streamDocumentUserChatPayload) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  if (!question) {
    throw new AppError("Question is required", 400);
  }

  // ─── Set response headers to enable SSE ────────────────────────────────────────────────────
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let globalChat = await initGlobalChatService(userId);

  const totalGlobalMessages = await getTotalGlobalMessagesByChatAndUserId(
    globalChat._id.toString(),
    userId,
  );
  const oldGlobalMessages = await getRecentGlobalMessagesByChatId(
    globalChat._id.toString(),
  );

  let globalSummary = globalChat.summary;

  if (totalGlobalMessages > MAX_HISTORY_LENGTH) {
    globalSummary = (await summarizeOldMessages(oldGlobalMessages)).toString();
    await updateGlobalChatSummary(userId, globalSummary);
  }

  const recentHistory = oldGlobalMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const embeddings = await generateEmbedding(question);
  const chunks = await getDocumentUserSimilarityScore(embeddings, userId);
  const context = chunks.map((chunk) => chunk.text).join("\n\n");

  const systemPrompt = getSystemPrompt(context, globalSummary);

  const stream = await client.chat.stream({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      { role: "user", content: question },
    ],
    stream: true,
    temperature: 0.4,
    topP: 1,
  });

  const relatedDocumentIds = new Set(
    chunks.map((chunk) => chunk.documentId.toString()),
  );

  await createGlobalMessage({
    role: "user",
    content: question,
    userId,
    chatId: globalChat._id.toString(),
    relatedDocumentIds: Array.from(relatedDocumentIds),
    embedding: embeddings,
  });

  let fullResponse = "";

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
    userId,
    chatId: globalChat._id.toString(),
    relatedDocumentIds: Array.from(relatedDocumentIds),
  });

  return fullResponse;
};
