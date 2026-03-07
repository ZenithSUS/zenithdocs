import { getSimilarityScore } from "../../repositories/document-chunk.repository.js";
import { Response } from "express";
import client from "./index.js";
import {
  createChat,
  getChatByDocument,
  appendMessages,
  updateChatSummary,
} from "../../repositories/chat.repository.js";
import { Types } from "mongoose";
import { IMessage } from "../../models/Chat.js";
import { getDocumentByIdService } from "../../services/document.service.js";
import AppError from "../../utils/app-error.js";

interface StreamChatPayload {
  question: string;
  documentId: string;
  userId: string;
  role: "admin" | "user";
  res: Response;
}

const MAX_HISTORY_LENGTH = 10;

const summarizeOldMessages = async (messages: IMessage[]) => {
  const text = messages.map((m) => `${m.role}: ${m.content}`).join("\n\n");

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: "Summarize this conversion briefy 2-3 sentences:\n\n" + text,
      },
    ],
    temperature: 0.4,
  });

  return response.choices?.[0]?.message?.content ?? "";
};

const queryEmbedding = async (question: string) => {
  const response = await client.embeddings.create({
    model: "mistral-embed",
    inputs: [question],
  });
  return response.data[0].embedding ?? [];
};

export const streamDocumentChatWithContextService = async ({
  question,
  documentId,
  userId,
  role,
  res,
}: StreamChatPayload) => {
  const document = await getDocumentByIdService(documentId, userId, role);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.status !== "completed") {
    throw new AppError("Document processing is not completed", 400);
  }

  let chat = await getChatByDocument(documentId, userId);
  if (!chat) {
    chat = await createChat({
      documentId: new Types.ObjectId(documentId),
      userId: new Types.ObjectId(userId),
      messages: [],
      summary: "",
    });
  }

  let summary = chat.summary;
  if (chat.messages.length > MAX_HISTORY_LENGTH) {
    const oldMessages = chat.messages.slice(0, MAX_HISTORY_LENGTH);
    summary = (await summarizeOldMessages(oldMessages)).toString();
    await updateChatSummary(chat._id.toString(), summary);
  }

  const recentHistory = chat.messages.slice(-MAX_HISTORY_LENGTH).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Get relevant chunks for the current question
  const embedding = await queryEmbedding(question);
  const chunks = await getSimilarityScore(embedding, documentId);
  const context = chunks.map((c) => c.text).join("\n\n");

  const systemPrompt = `
You are a helpful AI assistant. Answer the user's question based ONLY on the context provided below.
${summary ? "\nPrevious Conversion Summary:\n" + summary + "\n" : ""}

Rules:
- Write in plain, conversational text only
- Do NOT use markdown formatting (no **, no *, no #, no bullet dashes, no backticks)
- Do NOT use headers or bold/italic text
- Use plain numbered lists only if listing multiple items (e.g. "1. 2. 3.")
- Write in clear, natural paragraphs
- If the answer is not in the context, say "I don't have enough information to answer that."

Context:
${context}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let fullResponse = "";

  const stream = await client.chat.stream({
    model: "mistral-large-latest",
    messages: [
      { role: "user", content: systemPrompt }, // system context
      ...recentHistory, // previous conversation
      { role: "user", content: question }, // current question (clean, no prompt)
    ],
    stream: true,
    temperature: 0.4,
    topP: 1,
  });

  for await (const chunk of stream) {
    const token = chunk.data.choices[0].delta.content;
    if (token) {
      fullResponse += token;
      res.write(`data: ${token}\n\n`);
    }
  }

  res.write(`data: [DONE]\n\n`);
  res.end();

  await appendMessages(chat._id.toString(), [
    { role: "user", content: question, createdAt: new Date() },
    { role: "assistant", content: fullResponse, createdAt: new Date() },
  ]);

  return fullResponse;
};
