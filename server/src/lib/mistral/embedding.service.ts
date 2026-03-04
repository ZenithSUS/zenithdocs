import { Mistral } from "@mistralai/mistralai";
import config from "../../config/env.js";
import AppError from "../../utils/app-error.js";

const client = new Mistral({
  apiKey: config.ai.mistralai,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: "mistral-embed",
    inputs: [text],
  });

  if (!response.data) throw new AppError("Failed to generate embedding", 500);

  return response.data[0].embedding ?? [];
}
