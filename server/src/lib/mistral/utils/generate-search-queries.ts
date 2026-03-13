import client from "../index.js";

const MIN_WORDS_FOR_EXPANSION = 5;

const generateSearchQueries = async (question: string): Promise<string[]> => {
  // Skip expansion for vague/short questions
  if (question.trim().split(/\s+/).length < MIN_WORDS_FOR_EXPANSION) {
    return [];
  }

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "system",
        content: `Generate 2 keyword-based search queries to find document passages answering the question.
- Stay specific to the question's topic
- Use noun phrases and keywords, not conversational language  
- Return ONLY a JSON array of 2 strings`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    temperature: 0.2,
    maxTokens: 80,
  });

  const raw = response.choices?.[0]?.message?.content ?? "[]";

  try {
    // Strip markdown fences if model wraps output
    const cleaned = raw
      .toString()
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");

    const parsed = JSON.parse(cleaned);

    // Validate it's actually an array of strings
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
      .slice(0, 2);
  } catch {
    return [];
  }
};

export default generateSearchQueries;
