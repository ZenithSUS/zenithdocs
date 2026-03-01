import { Mistral } from "@mistralai/mistralai";
import config from "../../config/env.js";
import AppError from "../../utils/app-error.js";

const client = new Mistral({
  apiKey: config.ai.mistralai,
});

type SummaryType = "short" | "bullet" | "detailed" | "executive";

function buildSystemPrompt(type: SummaryType) {
  switch (type) {
    case "short":
      return `
You are a professional summarizer.

Provide a concise summary in 3–5 sentences.
Use plain text only.
Do NOT use markdown, asterisks, hashtags, bullet points, or special symbols.
Do NOT include titles or section headers.
Write in clean paragraph format.
Keep it clear, compact, and direct.
`;

    case "bullet":
      return `
You are a professional summarizer.

Summarize the text using bullet-style formatting.

Formatting rules:
- Use a simple dash followed by a space (example: - Insight here)
- Do NOT use asterisks (*)
- Do NOT use markdown formatting
- Do NOT use bold, italics, or hashtags
- No section headers
- Keep each bullet short and precise

Focus only on key insights and important facts.
`;

    case "detailed":
      return `
You are a professional analyst.

Provide a structured and detailed summary in plain text.

Formatting rules:
- No markdown
- No asterisks
- No hashtags
- No bold or special characters
- No section headers
- Use clear paragraphs separated by line breaks

Include key arguments, supporting points, and conclusions.
Maintain logical flow and clarity.
Professional tone only.
`;

    case "executive":
      return `
You are a senior business analyst writing for executives.

Create an executive-level summary.

Formatting rules:
- Output must be plain text only
- Do NOT use markdown formatting
- Do NOT use asterisks (*), hashtags (#), or decorative symbols
- Do NOT include section titles
- Do NOT use bold or italic styling
- Use clean paragraphs separated by line breaks only

Content requirements:
- Focus on insights
- Highlight strategic impact
- Explain business implications
- Provide recommended actions
- Maintain an authoritative and professional tone
- Avoid unnecessary detail

Deliver structured, executive-ready plain text.
`;

    default:
      return "You are a helpful assistant that summarizes text.";
  }
}

const MAX_CHARS_PER_CHUNK = 12000; // ~3000 tokens
const CHUNK_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunkText(text: string, maxChars: number): string[] {
  const chunks: string[] = [];

  // Try to split on paragraph boundaries first
  const paragraphs = text.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length > maxChars) {
      if (current) chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function callMistralWithRetry(
  content: string,
  systemPrompt: string,
  retries = 4,
  baseDelay = 2000,
): Promise<{ text: string; tokens: number }> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
        temperature: 0.4,
      });

      return {
        text: (response.choices?.[0]?.message?.content ?? "").toString(),
        tokens: response.usage?.totalTokens ?? 0,
      };
    } catch (error: unknown) {
      const err = error as {
        statusCode?: number;
        message?: string;
      };

      const is429 =
        err?.statusCode === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("rate_limited") ||
        err?.message?.toLowerCase().includes("rate limit");

      if (is429 && attempt < retries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  throw new AppError("Failed to generate summary", 500);
}

export const summarizeText = async (
  content: string,
  type: SummaryType,
  currentTokens: number, // tokens already used this month
  maxTokens: number, // user's plan token limit
) => {
  const systemPrompt = buildSystemPrompt(type);
  let runningTokenTotal = currentTokens;

  // Small content — send directly
  if (content.length <= MAX_CHARS_PER_CHUNK) {
    const result = await callMistralWithRetry(content, systemPrompt);

    // Check if this single call would exceed the limit
    if (runningTokenTotal + result.tokens > maxTokens) {
      throw new AppError(
        `You've run out of tokens for this month. Please upgrade your plan or wait until next month to continue.`,
        400,
      );
    }

    return { content: result.text, tokensUsed: result.tokens };
  }

  // Large content — chunked
  const chunks = chunkText(content, MAX_CHARS_PER_CHUNK);

  let totalTokens = 0;
  const chunkSummaries: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const estimatedChunkTokens = Math.ceil(chunks[i].length / 4);

    const remaining = Math.max(0, maxTokens - runningTokenTotal - totalTokens);

    // Check if this chunk would exceed the limit
    if (runningTokenTotal + totalTokens + estimatedChunkTokens > maxTokens) {
      throw new AppError(
        `This document is too large to summarize with your current plan. You have remaining ${remaining.toLocaleString()} tokens. Try a shorter document or upgrade your plan for more capacity.`,
        400,
      );
    }

    const result = await callMistralWithRetry(chunks[i], systemPrompt);
    chunkSummaries.push(result.text);
    totalTokens += result.tokens;

    // Check if this chunk would exceed the limit
    if (runningTokenTotal + totalTokens > maxTokens) {
      throw new AppError(
        `Your token limit was reached while processing this document. Partial summaries cannot be saved. Please upgrade your plan to handle larger documents.`,
        400,
      );
    }

    // Add a delay between chunks
    if (i < chunks.length - 1) await sleep(CHUNK_DELAY_MS);
  }

  if (chunkSummaries.length === 1) {
    return { content: chunkSummaries[0], tokensUsed: totalTokens };
  }

  // Final combination pass — check before calling
  const estimatedFinalTokens = Math.ceil(
    chunkSummaries.join("\n\n").length / 4,
  );

  const remaining = Math.max(0, maxTokens - runningTokenTotal - totalTokens);

  if (runningTokenTotal + totalTokens + estimatedFinalTokens > maxTokens) {
    throw new AppError(
      `Almost there, but you don't have enough tokens left to finalize this summary. You have ${remaining.toLocaleString()} tokens remaining. Upgrade your plan to process larger documents.`,
      400,
    );
  }
  const combined = chunkSummaries.join("\n\n");
  const finalResult = await callMistralWithRetry(combined, systemPrompt);
  totalTokens += finalResult.tokens;

  return {
    content: finalResult.text,
    tokensUsed: totalTokens,
  };
};
