import { IMessage } from "../../../models/Message.js";
import client from "../index.js";

const summarizeOldMessages = async (messages: IMessage[]) => {
  const text = messages.map((m) => `${m.role}: ${m.content}`).join("\n\n");

  const response = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
      {
        role: "user",
        content: "Summarize this conversion briefy 2-3 sentences:\n\n" + text,
      },
    ],
    temperature: 0.4,
    maxTokens: 80,
  });

  console.log("Summarize token usage:", response.usage);

  return response.choices?.[0]?.message?.content ?? "";
};

export default summarizeOldMessages;
