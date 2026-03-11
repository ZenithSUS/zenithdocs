import AppError from "../../../utils/app-error.js";
import chunkText from "../utils/chunk-text.js";
import client from "../index.js";

type SummaryType = "short" | "bullet" | "detailed" | "executive";

export interface AdditionalDetails {
  risk: string; // e.g. "Auto-renewal clause ($4.2M)"
  action: string; // e.g. "Sign before March 1, 2024"
  entity: string[]; // e.g. ["Acme Corp", "John Doe (CEO)"]
}

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

const ADDITIONAL_DETAILS_SYSTEM_PROMPT = `
You are an expert document analyst. You read any type of document — contracts, resumes, reports, invoices, research papers, emails, proposals, policies, and more.

Analyze the provided text and return a JSON object with exactly these fields:

{
  "risk": "string",
  "action": "string",
  "entity": ["string"]
}

━━━ FIELD DEFINITIONS ━━━

risk:
  Identify the most significant risk, gap, concern, or weakness in the document.
  Adapt your analysis to the document type:
  - Contract/Legal  → "Auto-renewal clause present", "Indemnity clause missing"
  - Resume/CV       → "No quantified achievements listed", "3-year employment gap (2019–2022)"
  - Report/Analysis → "Conclusion not supported by data", "Sample size too small (n=12)"
  - Invoice/Finance → "Payment overdue by 45 days", "Missing tax identification number"
  - Email/Memo      → "No clear decision maker assigned", "Deadline not specified"
  - Proposal        → "Budget section absent", "ROI not addressed"
  - Policy          → "Enforcement mechanism unclear", "Last reviewed 4 years ago"
  - General         → Identify any notable weakness, inconsistency, or missing element

  If genuinely no risk exists, return "No significant risk identified".
  Maximum 10 words. Be specific — never vague.

action:
  Identify the most important next step, deadline, or recommended action from the document.
  Adapt to the document type:
  - Contract/Legal  → "Sign before March 1, 2024", "Negotiate liability cap before signing"
  - Resume/CV       → "Add metrics to work experience", "Include a summary section"
  - Report/Analysis → "Expand sample size before publishing", "Validate findings with follow-up study"
  - Invoice/Finance → "Process payment by due date", "Request missing invoice number"
  - Email/Memo      → "Respond by end of week", "Schedule follow-up meeting"
  - Proposal        → "Submit by RFP deadline", "Add cost-benefit breakdown"
  - Policy          → "Schedule annual review", "Assign policy owner"
  - General         → Identify any clear next step or improvement action

  If no action is needed, return "No immediate action required".
  Maximum 10 words. Be direct and actionable.

entity:
  Extract the most relevant named entities from the document.
  - People: include role/title if mentioned (e.g. "Jane Smith (CTO)", "John Doe (Applicant)")
  - Organizations: companies, institutions, agencies (e.g. "Acme Corp", "MIT", "IRS")
  - Systems/Tools: software, platforms, technologies (e.g. "Salesforce", "AWS Lambda", "PostgreSQL")
  - Locations: cities, countries, addresses if significant (e.g. "San Francisco, CA")
  - Dates/Deadlines: only if critical (e.g. "March 1, 2024 (deadline)")
  Extract up to 8 of the most relevant. If none found, return [].

━━━ RULES ━━━
- Return ONLY valid JSON. No explanations, no markdown, no preamble.
- Do NOT wrap output in backticks or code blocks.
- Never return vague placeholders like "N/A", "Unknown", or "See document".
- Always produce a meaningful risk and action — think carefully before defaulting to fallbacks.
`;

const MAX_CHARS_PER_CHUNK = 12000; // ~3000 tokens
const CHUNK_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  throw new AppError("Failed to generate summary", 500);
}

const ADDITIONAL_DETAILS_FALLBACK: AdditionalDetails = {
  risk: "None identified",
  action: "No action required",
  entity: [],
};

async function extractAdditionalDetails(
  content: string,
): Promise<{ details: AdditionalDetails; tokens: number }> {
  // Use first 8000 chars — enough context without burning extra tokens
  const excerpt = content.slice(0, 8000);

  try {
    const result = await callMistralWithRetry(
      excerpt,
      ADDITIONAL_DETAILS_SYSTEM_PROMPT,
    );

    const parsed = JSON.parse(result.text) as AdditionalDetails;

    const details: AdditionalDetails = {
      risk:
        typeof parsed.risk === "string" && parsed.risk.trim()
          ? parsed.risk.trim()
          : ADDITIONAL_DETAILS_FALLBACK.risk,
      action:
        typeof parsed.action === "string" && parsed.action.trim()
          ? parsed.action.trim()
          : ADDITIONAL_DETAILS_FALLBACK.action,
      entity: Array.isArray(parsed.entity)
        ? parsed.entity.filter((e) => typeof e === "string").slice(0, 8)
        : [],
    };

    return { details, tokens: result.tokens };
  } catch {
    // Never let metadata extraction break the main summary
    return { details: ADDITIONAL_DETAILS_FALLBACK, tokens: 0 };
  }
}

export const summarizeText = async (
  content: string,
  type: SummaryType,
  currentTokens: number,
  maxTokens: number,
) => {
  const systemPrompt = buildSystemPrompt(type);
  let runningTokenTotal = currentTokens;

  // ─── Small content — send directly ───────────────────────────────────────
  if (content.length <= MAX_CHARS_PER_CHUNK) {
    const result = await callMistralWithRetry(content, systemPrompt);

    if (runningTokenTotal + result.tokens > maxTokens) {
      throw new AppError(
        `You've run out of tokens for this month. Please upgrade your plan or wait until next month to continue.`,
        400,
      );
    }

    const { details, tokens: detailTokens } =
      await extractAdditionalDetails(content);

    return {
      content: result.text,
      additionalDetails: details,
      tokensUsed: result.tokens + detailTokens,
    };
  }

  // ─── Large content — chunked ──────────────────────────────────────────────
  const chunks = chunkText(content, MAX_CHARS_PER_CHUNK);

  let totalTokens = 0;
  const chunkSummaries: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const estimatedChunkTokens = Math.ceil(chunks[i].length / 4);
    const remaining = Math.max(0, maxTokens - runningTokenTotal - totalTokens);

    if (runningTokenTotal + totalTokens + estimatedChunkTokens > maxTokens) {
      throw new AppError(
        `This document is too large to summarize with your current plan. You have ${remaining.toLocaleString()} tokens remaining. Try a shorter document or upgrade your plan for more capacity.`,
        400,
      );
    }

    const result = await callMistralWithRetry(chunks[i], systemPrompt);
    chunkSummaries.push(result.text);
    totalTokens += result.tokens;

    if (runningTokenTotal + totalTokens > maxTokens) {
      throw new AppError(
        `Your token limit was reached while processing this document. Partial summaries cannot be saved. Please upgrade your plan to handle larger documents.`,
        400,
      );
    }

    if (i < chunks.length - 1) await sleep(CHUNK_DELAY_MS);
  }

  // ─── Single chunk result ──────────────────────────────────────────────────
  if (chunkSummaries.length === 1) {
    const { details, tokens: detailTokens } =
      await extractAdditionalDetails(content);

    return {
      content: chunkSummaries[0],
      additionalDetails: details,
      tokensUsed: totalTokens + detailTokens,
    };
  }

  // ─── Final combination pass ───────────────────────────────────────────────
  const combined = chunkSummaries.join("\n\n");
  const estimatedFinalTokens = Math.ceil(combined.length / 4);
  const remaining = Math.max(0, maxTokens - runningTokenTotal - totalTokens);

  if (runningTokenTotal + totalTokens + estimatedFinalTokens > maxTokens) {
    throw new AppError(
      `Almost there, but you don't have enough tokens left to finalize this summary. You have ${remaining.toLocaleString()} tokens remaining. Upgrade your plan to process larger documents.`,
      400,
    );
  }

  const finalResult = await callMistralWithRetry(combined, systemPrompt);
  totalTokens += finalResult.tokens;

  const { details, tokens: detailTokens } =
    await extractAdditionalDetails(content);

  return {
    content: finalResult.text,
    additionalDetails: details,
    tokensUsed: totalTokens + detailTokens,
  };
};
