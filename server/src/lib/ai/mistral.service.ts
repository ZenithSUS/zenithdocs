import { Mistral } from "@mistralai/mistralai";
import config from "../../config/env.js";

const client = new Mistral({
  apiKey: config.ai.mistralai,
});

type SummaryType = "short" | "bullet" | "detailed" | "executive";

function buildSystemPrompt(type: SummaryType) {
  switch (type) {
    case "short":
      return `
You are a professional summarizer.
Provide a very concise summary (3-5 sentences max).
Keep it clear, compact, and easy to understand.
Avoid extra commentary.
`;

    case "bullet":
      return `
You are a professional summarizer.
Summarize the text using bullet points.
Use short, sharp bullets.
Focus only on key ideas and important facts.
No paragraphs.
`;

    case "detailed":
      return `
You are a professional analyst.
Provide a structured and detailed summary.
Include key arguments, supporting points, and conclusions.
Use well-formed paragraphs.
Maintain clarity and logical flow.
`;

    case "executive":
      return `
You are a senior business analyst writing for executives.
Create an executive-level summary.
Focus on insights, impact, strategic implications, and decisions.
Professional tone.
No unnecessary details.
Clear and authoritative.
`;

    default:
      return "You are a helpful assistant that summarizes text.";
  }
}

export const summarizeText = async (content: string, type: SummaryType) => {
  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(type),
      },
      {
        role: "user",
        content,
      },
    ],
    temperature: 0.4, // Lower = more consistent summaries
  });

  const output = response.choices?.[0]?.message?.content ?? "";

  return {
    content: output,
    tokensUsed: response.usage.totalTokens ?? 0,
  };
};
