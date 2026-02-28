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
