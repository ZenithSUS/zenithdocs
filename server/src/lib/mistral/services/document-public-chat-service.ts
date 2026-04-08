import { Request, Response } from "express";
import { getSimilarityScore } from "../../../repositories/document-chunk.repository.js";
import { getDocumentById } from "../../../repositories/document.repository.js";
import { streamPublicDocumentChatSchema } from "../../../schemas/chat.schema.js";
import { getDocumentShareByTokenService } from "../../../services/document-share.service.js";
import AppError from "../../../utils/app-error.js";
import calculateDocumentConfidenceScore from "../utils/document-confidence.score.js";
import { generateEmbedding } from "./embedding.service.js";
import client from "../index.js";

interface PublicStreamChatPayload {
  question: string;
  shareToken: string;
  history: {
    role: "user" | "assistant";
    content: string;
  }[];
  res: Response;
  req: Request;
}

const MAX_PUBLIC_MESSAGES = 20;

export const streamDocumentPublicChatService = async (
  payload: PublicStreamChatPayload,
) => {
  const { question, shareToken, history, res } = payload;

  const validated = streamPublicDocumentChatSchema.parse({
    question,
    shareToken,
  });

  const sharedDocument = await getDocumentShareByTokenService(
    validated.shareToken,
    payload.req,
  );

  if (sharedDocument.type !== "public") {
    throw new AppError("Invalid share token", 400);
  }

  const document = await getDocumentById(
    sharedDocument.documentId._id.toString(),
  );

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (history && history.length >= MAX_PUBLIC_MESSAGES) {
    throw new AppError(
      `You have reached the maximum number of messages (${MAX_PUBLIC_MESSAGES}) in the public chat. Please refresh or delete the message to start new one`,
      400,
    );
  }

  const embedding = await generateEmbedding(validated.question);
  const chunks = await getSimilarityScore(embedding, document._id.toString());
  const context = chunks.map((c) => c.text).join("\n\n");
  const confidenceScore = calculateDocumentConfidenceScore(chunks);

  const MAX_HISTORY_LENGTH = 10;
  const MAX_CONTENT_LENGTH = 2000;

  const recentHistory =
    history && history.length > 0
      ? history.slice(-MAX_HISTORY_LENGTH).map((m) => ({
          role: m.role,
          content: m.content.slice(0, MAX_CONTENT_LENGTH),
        }))
      : [];

  const systemPrompt = `
You are a helpful AI assistant. Answer the user's question based ONLY on the context provided below.

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
      { role: "system", content: systemPrompt },
      ...recentHistory,
      {
        role: "user",
        content: validated.question,
      },
    ],
    stream: true,
    temperature: 0.4,
    maxTokens: 1000,
  });

  let fullResponse = "";

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
  res.write(`data: [DONE]\n\n`);
  res.end();

  return fullResponse;
};
