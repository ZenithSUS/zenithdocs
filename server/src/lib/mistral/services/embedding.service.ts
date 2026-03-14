import AppError from "../../../utils/app-error.js";
import colors from "../../../utils/log-colors.js";
import client from "../index.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 5000,
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.statusCode === 429;
      const isLastAttempt = i === retries - 1;

      if (isRateLimit && !isLastAttempt) {
        const wait = delay * Math.pow(2, i); // 5s → 10s → 20s
        console.log("=".repeat(50));
        console.warn(
          `${colors.yellow}[Mistral]${colors.reset} Rate limited. Retrying in ${wait}ms... (${i + 1}/${retries})`,
        );
        console.log("=".repeat(50));
        await sleep(wait);
        continue;
      }

      throw error;
    }
  }
  throw new AppError("Max retries reached", 429);
};

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await withRetry(() =>
    client.embeddings.create({
      model: "mistral-embed",
      inputs: [text],
    }),
  );

  if (!response.data) throw new AppError("Failed to generate embedding", 500);

  return response.data[0].embedding ?? [];
}
