import { getSimilarityScore } from "../../../repositories/document-chunk.repository.js";
import { Response } from "express";
import client from "../index.js";
import {
  createChat,
  getChatByDocument,
  updateChatSummary,
} from "../../../repositories/chat.repository.js";
import {
  createMessage,
  getRecentMessagesByChatId,
  getTotalMessagesByChatIdAndUser,
} from "../../../repositories/message.repository.js";
import summarizeOldMessages from "../utils/summarize-message.js";
import calculateDocumentConfidenceScore from "../utils/document-confidence.score.js";
import redis from "../../../config/redis.js";
import queryEmbedding from "../utils/query-embedding.js";
import { streamDocumentChatSchema } from "../../../schemas/chat.schema.js";
import { userTokenSchema } from "../../../utils/zod.utils.js";

interface StreamChatPayload {
  question: string;
  documentId: string;
  userId: string;
  role: "admin" | "user";
  res: Response;
}

const MAX_HISTORY_LENGTH = 10;

export const streamDocumentChatWithContextService = async ({
  question,
  documentId,
  userId,
  role,
  res,
}: StreamChatPayload) => {
  const validated = streamDocumentChatSchema.parse({ question, documentId });
  const authUser = userTokenSchema.parse({ userId, role });

  let chat = await getChatByDocument(validated.documentId, authUser.userId);

  if (!chat) {
    chat = await createChat({
      documentId,
      userId,
      summary: "",
    });
  }

  const totalMessages = await getTotalMessagesByChatIdAndUser(
    chat._id.toString(),
    authUser.userId,
  );
  const oldMessages = await getRecentMessagesByChatId(chat._id.toString());

  let summary = chat.summary;

  if (totalMessages > MAX_HISTORY_LENGTH) {
    summary = (await summarizeOldMessages(oldMessages)).toString();
    await updateChatSummary(chat._id.toString(), summary);
  }

  const recentHistory = oldMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Get relevant chunks for the current question
  const cacheKey = `embedding:${question}`;
  const cacheEmbedding = await redis.get(cacheKey);

  const embedding = cacheEmbedding
    ? JSON.parse(cacheEmbedding)
    : await queryEmbedding(question);

  if (!cacheEmbedding)
    await redis.setex(cacheKey, 3600, JSON.stringify(embedding));

  const chunks = await getSimilarityScore(embedding, validated.documentId);
  const context = chunks.map((c) => c.text).join("\n\n");
  const confidenceScore = calculateDocumentConfidenceScore(chunks);

  const systemPrompt = `
You are a helpful AI assistant. Answer the user's question based ONLY on the context provided below.
${summary ? "\nPrevious Conversion Summary:\n" + summary + "\n" : ""}

Rules:
- Answer the user's question base ONLY on the context provided
- Do not answer questions that are not in the context
- Use markdown formatting to structure your response clearly
- Use **bold** for key terms or important points
- Use bullet points or numbered lists when listing multiple items
- Use headers (##) for distinct sections when the answer is long
- Write in clear, natural paragraphs
- Keep code or technical terms in \`backticks\`
- If the answer is not in the context, say "I don't have enough information to answer that."

Context:
${context}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const stream = await client.chat.stream({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: systemPrompt }, // system context
      ...recentHistory, // previous conversation
      { role: "user", content: validated.question }, // current question (clean, no prompt)
    ],
    stream: true,
    temperature: 0.4,
    topP: 1,
    maxTokens: 2000,
  });

  await createMessage({
    chatId: chat._id.toString(),
    userId: authUser.userId,
    role: "user",
    content: question,
    createdAt: new Date(),
  });

  let fullResponse = "";

  res.write(
    `data: [CONFIDENCE]:${JSON.stringify({ score: confidenceScore })}\n\n`,
  );

  for await (const chunk of stream) {
    const token = chunk.data.choices[0]?.delta?.content;

    if (token) {
      fullResponse += token;

      const encoded = token.toString().replace(/\n/g, "\\n");
      res.write(`data: ${encoded}\n\n`);
    }
  }
  res.write(`data: [DONE]\n\n`);
  res.end();

  await createMessage({
    chatId: chat._id.toString(),
    userId: authUser.userId,
    role: "assistant",
    content: fullResponse,
    confidenceScore,
    createdAt: new Date(),
  });

  return fullResponse;
};
