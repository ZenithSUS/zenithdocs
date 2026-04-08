import { IDocumentChunk } from "../../../models/document-chunk.model.js";
import { ILearningItem } from "../../../models/learning-set.model.js";
import { getDocumentChunksByDocumentId } from "../../../repositories/document-chunk.repository.js";
import { getDocumentById } from "../../../repositories/document.repository.js";
import { incrementOnlyAIRequests } from "../../../repositories/usage.repository.js";
import AppError from "../../../utils/app-error.js";
import colors from "../../../utils/log-colors.js";
import client from "../index.js";

export type LearningItemType =
  | "general"
  | "mcq"
  | "tf"
  | "identification"
  | "flashcard";

export interface GenerateLearningSetPayload {
  type: "quiz" | "reviewer" | "flashcard";
  itemType: LearningItemType;
  difficulty: "easy" | "medium" | "hard";
  documentId: string;
  ownerId: string;
  role: "user" | "admin";
}

const SYSTEM_PROMPT = (itemType: LearningItemType): string => {
  const baseRules = `
You are a learning set generator. Given document chunks and parameters, generate a structured learning set in valid JSON that strictly follows the schema below.

## Output Format

Return ONLY a valid JSON object. No markdown, no explanation, no code blocks.

## Schema

{
  "documentId": "<string>",
  "ownerId": "<string>",
  "type": "quiz" | "reviewer" | "flashcard",
  "title": "<string> (optional)",
  "difficulty": "easy" | "medium" | "hard",
  "chunkHashes": ["<string>"],
  "source": "ai",
  "items": [ ...see item rules below ]
}

## Inputs You Will Receive

- type: The learning set type ("quiz", "reviewer", or "flashcard")
- difficulty: The difficulty level ("easy", "medium", or "hard") — ALWAYS follow this exactly
- chunks: An array of document chunks, each with:
  - hash: A unique identifier for the chunk
  - content: The text content to base items on

## Difficulty Rules

Apply difficulty consistently across ALL generated items:

- easy:
  - Recall-level questions (definitions, facts, direct answers)
  - Flashcard fronts should ask simple "What is X?" questions
  - MCQ distractors should be clearly wrong

- medium:
  - Comprehension-level questions (explain, describe, compare)
  - Flashcard fronts should ask "How" or "Why" questions
  - MCQ distractors should be plausible but distinguishable

- hard:
  - Application or analysis-level questions (apply, evaluate, infer)
  - Flashcard fronts should challenge with edge cases or implications
  - MCQ distractors should be closely related and require careful reasoning

## Chunk Rules

- Generate items ONLY from the provided chunks.
- Include ALL chunk hashes in the "chunkHashes" array, even if a chunk contributed no items.
- Distribute items across chunks evenly when possible.
- Do not fabricate information not present in the chunks.`;

  const itemRules: Record<LearningItemType, string> = {
    general: `
## Item Rules

Generate a MIX of all item types: "mcq", "tf", "identification", "flashcard".
Vary item types naturally and distribute them evenly across chunks.

### type: "flashcard"
- Required: type, front, back, answer (answer = back)
- Omit: question, choices, explanation
- "back" and "answer" MUST be a concise keyword or phrase (1–5 words max). Never a full sentence.
- "front" is the prompt or question shown to the learner.
- Example:
  { "type": "flashcard", "front": "What is Newton's First Law?", "back": "Law of Inertia", "answer": "Law of Inertia" }

### type: "mcq"
- Required: type, question, choices (min 4), answer (must be one of choices)
- Optional: explanation
- Omit: front, back
- Example:
  { "type": "mcq", "question": "What is photosynthesis?", "choices": ["Energy conversion", "Water absorption", "Respiration", "Digestion"], "answer": "Energy conversion", "explanation": "Plants convert sunlight into glucose." }

### type: "tf"
- Required: type, question, answer ("True" or "False")
- Optional: explanation
- Omit: choices, front, back
- Example:
  { "type": "tf", "question": "The Earth revolves around the Sun.", "answer": "True", "explanation": "The Earth orbits the Sun once every 365.25 days." }

### type: "identification"
- Required: type, question, answer
- Optional: explanation
- Omit: choices, front, back
- "answer" MUST be a specific name, term, or keyword (1–5 words max). Never a full sentence.
- Questions should prompt a specific name, term, or concept as the answer.
- Example:
  { "type": "identification", "question": "What organ pumps blood throughout the body?", "answer": "Heart", "explanation": "The heart is the central organ of the circulatory system." }`,

    mcq: `
## Item Rules

Generate ONLY "mcq" items. Do NOT generate any other item type.

### type: "mcq"
- Required: type, question, choices (min 4), answer (must be one of choices)
- Optional: explanation
- Omit: front, back
- Example:
  { "type": "mcq", "question": "What is photosynthesis?", "choices": ["Energy conversion", "Water absorption", "Respiration", "Digestion"], "answer": "Energy conversion", "explanation": "Plants convert sunlight into glucose." }`,

    tf: `
## Item Rules

Generate ONLY "tf" (True or False) items. Do NOT generate any other item type.

### type: "tf"
- Required: type, question, answer ("True" or "False" — no other values allowed)
- Optional: explanation
- Omit: choices, front, back
- Balance True and False answers evenly across items.
- Example:
  { "type": "tf", "question": "The Earth revolves around the Sun.", "answer": "True", "explanation": "The Earth orbits the Sun once every 365.25 days." }`,

    identification: `
## Item Rules

Generate ONLY "identification" items. Do NOT generate any other item type.

### type: "identification"
- Required: type, question, answer
- Optional: explanation
- Omit: choices, front, back
- "answer" MUST be a specific name, term, or keyword (1–5 words max). Never a full sentence.
- Questions should prompt a specific name, term, or concept as the answer.
- Example:
  { "type": "identification", "question": "What organ pumps blood throughout the body?", "answer": "Heart", "explanation": "The heart is the central organ of the circulatory system." }`,

    flashcard: `
## Item Rules

Generate ONLY "flashcard" items. Do NOT generate any other item type.

### type: "flashcard"
- Required: type, front, back, answer (answer = back)
- Omit: question, choices, explanation
- "back" and "answer" MUST be a concise keyword or phrase (1–5 words max). Never a full sentence.
- "front" is the prompt or question shown to the learner.
- Example:
  { "type": "flashcard", "front": "What is Newton's First Law?", "back": "Law of Inertia", "answer": "Law of Inertia" }`,
  };

  const constraints = `
## Constraints

- Never include "front" or "back" on non-flashcard items.
- Never include "choices" on non-mcq items.
- Do not invent content outside of the provided chunks.
- Always include all chunk hashes in "chunkHashes".
- Always respect the given difficulty — do not override it.
- Do not fabricate information not present in the chunks.`;

  return baseRules + itemRules[itemType] + constraints;
};

const BATCH_SIZE = 10;

const callModel = async (
  chunks: IDocumentChunk[],
  type: "quiz" | "reviewer" | "flashcard",
  itemType: LearningItemType,
  difficulty: "easy" | "medium" | "hard",
  documentId: string,
  ownerId: string,
) => {
  const userMessage = JSON.stringify({
    documentId,
    ownerId,
    type,
    difficulty,
    chunks: chunks.map((c) => ({
      hash: c._id.toString(),
      content: c.text,
    })),
  });

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT(itemType) },
      { role: "user", content: userMessage },
    ],
    responseFormat: { type: "json_object" },
    temperature: 0.4,
  });

  const raw = response.choices?.[0]?.message?.content;
  if (!raw) {
    throw new AppError("No response from model", 500);
  }

  const parsed = JSON.parse(raw.toString());
  return parsed;
};

export const generateLearningSets = async ({
  type,
  difficulty,
  itemType,
  documentId,
  ownerId,
  role,
}: GenerateLearningSetPayload) => {
  const document = await getDocumentById(documentId);

  if (!document) {
    throw new AppError("Document not found", 404);
  }

  if (document.user._id.toString() !== ownerId && role !== "admin") {
    throw new AppError("You are not the owner of this document", 403);
  }

  const chunks = await getDocumentChunksByDocumentId(documentId);

  if (!chunks.length) {
    throw new AppError("No document chunks found", 400);
  }

  const batches: IDocumentChunk[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    batches.push(chunks.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.allSettled(
    batches.map((batch) =>
      callModel(batch, type, itemType, difficulty, documentId, ownerId),
    ),
  );

  const mergedItems: ILearningItem[] = [];
  const mergedHashes: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      mergedItems.push(...(result.value.items ?? []));
      mergedHashes.push(...(result.value.chunkHashes ?? []));
    } else {
      console.log("=".repeat(50));
      console.log(
        `${colors.red}Error generating learning set for batch ${index}: ${colors.reset}`,
        result.reason,
      );
      console.log("=".repeat(50) + "\n");
    }
  });

  if (!mergedItems.length) {
    throw new AppError("All batches failed. No items generated.", 500);
  }

  await incrementOnlyAIRequests(ownerId);

  return {
    documentId,
    ownerId,
    type,
    difficulty,
    items: mergedItems,
    chunkHashes: mergedHashes,
    source: "ai" as const,
  };
};
