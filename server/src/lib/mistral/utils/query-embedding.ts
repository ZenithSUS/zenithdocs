import client from "../index.js";

const queryEmbedding = async (question: string) => {
  const response = await client.embeddings.create({
    model: "mistral-embed",
    inputs: [question],
  });
  return response.data[0].embedding ?? [];
};

export default queryEmbedding;
