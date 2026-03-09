import { getSimilarityScore } from "../../repositories/document-chunk.repository.js";
import { Response } from "express";
import client from "./index.js";
import {
  createChat,
  getChatByDocument,
  updateChatSummary,
} from "../../repositories/chat.repository.js";
import { Types } from "mongoose";
import { getDocumentByIdService } from "../../services/document.service.js";
import AppError from "../../utils/app-error.js";
import { IMessage } from "../../models/Message.js";
import {
  createMessages,
  getRecentMessagesByChatId,
  getTotalMessagesByChatIdAndUser,
} from "../../repositories/message.repository.js";

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
      summary: "",
    });
  }

  const totalMessages = await getTotalMessagesByChatIdAndUser(
    chat._id.toString(),
    userId,
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
  const embedding = await queryEmbedding(question);
  const chunks = await getSimilarityScore(embedding, documentId);
  const context = chunks.map((c) => c.text).join("\n\n");

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

  let fullResponse = "";

  const stream = await client.chat.stream({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: systemPrompt }, // system context
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

      const encoded = token.toString().replace(/\n/g, "\\n");
      res.write(`data: ${encoded}\n\n`);
    }
  }
  res.write(`data: [DONE]\n\n`);
  res.end();

  await createMessages([
    {
      chatId: chat._id.toString(),
      userId,
      role: "user",
      content: question,
      createdAt: new Date(),
    },
    {
      chatId: chat._id.toString(),
      userId,
      role: "assistant",
      content: fullResponse,
      createdAt: new Date(Date.now() + 1000),
    },
  ]);

  return fullResponse;
};
