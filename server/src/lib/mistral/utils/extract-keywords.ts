const extractKeywords = (question: string): string[] => {
  const keywords: string[] = [];

  // Quoted phrases: "Cs 2x2", "Sales Report"
  const quoted = question.match(/"([^"]+)"/g);
  if (quoted) {
    keywords.push(...quoted.map((q) => q.replace(/"/g, "").trim()));
  }

  const capitalized = question
    .replace(/"[^"]+"/g, "")
    .match(/\b[A-Z][a-zA-Z0-9]{2,}\b/g);

  if (capitalized) {
    const stopWords = new Set([
      "The",
      "What",
      "How",
      "Can",
      "Does",
      "Tell",
      "Show",
      "Give",
      "Find",
      "There",
      "File",
      "Name",
    ]);
    keywords.push(...capitalized.filter((w) => !stopWords.has(w)));
  }

  // Alphanumeric tokens with at least 2 chars, must include both letters and numbers (e.g. "CS101", "2x2")
  const fileTokens = question
    .replace(/"[^"]+"/g, "")
    .split(/\s+/)
    .filter((token) => {
      const clean = token.replace(/[^a-zA-Z0-9]/g, "");
      return (
        clean.length >= 2 &&
        /[a-zA-Z]/.test(clean) && // must have at least one letter
        /[0-9]/.test(clean) // must have at least one number (e.g. 2x2, CS101)
      );
    })
    .map((t) => t.replace(/[^a-zA-Z0-9]/g, ""));

  keywords.push(...fileTokens);

  // Short uppercase tokens like "CS", "NDA", "HR"
  const upperTokens = question.replace(/"[^"]+"/g, "").match(/\b[A-Z]{2,}\b/g);

  if (upperTokens) {
    keywords.push(...upperTokens);
  }

  return [...new Set(keywords)].filter(Boolean);
};

export default extractKeywords;
