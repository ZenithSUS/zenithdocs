import config from "@/config/env";
import { api } from "@/lib/axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { Chat, MessageInput } from "@/types/chat";

export const initChatForDocument = async (documentId: string) => {
  const { data: res } = await api.post<ResponseWithData<Chat>>(
    `/api/chat/document/${documentId}/init`,
  );
  return res.data;
};

export const fetchChatByDocumentId = async (documentId: string) => {
  const { data: res } = await api.get<ResponseWithData<Chat>>(
    `/api/chat/document/${documentId}`,
  );

  return res.data;
};

export const fetchChatByUserPaginated = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const { data: res } = await api.get<ResponseWithPagedData<Chat, "chats">>(
    `api/chat/user/${userId}`,
    {
      params: {
        page,
        limit,
      },
    },
  );

  return res.data;
};

export const createChat = async (data: MessageInput) => {
  const { data: res } = await api.post<ResponseWithData<Chat>>(
    "/api/chat",
    data,
    { timeout: 300000 }, // 5 minutes timeout
  );
  return res.data;
};

export const createChatStream = async (
  data: MessageInput,
  onChunk: (chunk: string) => void,
  onDone: () => void,
) => {
  const token = localStorage.getItem("accessToken") as string;

  const response = await fetch(`${config.api.baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": config.api.key,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to send message");
  if (!response.body) throw new Error("No stream body");

  const reader = response.body.getReader();

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process all complete lines in buffer
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const text = line.slice(6);

      if (text === "[DONE]") {
        onDone();
        return;
      }

      // Decode the encoded newlines back
      const decoded = text.replace(/\\n/g, "\n");
      onChunk(decoded);
    }
  }

  // Flush any remaining buffer
  if (buffer.startsWith("data: ")) {
    const text = buffer.slice(6);
    if (text && text !== "[DONE]") onChunk(text);
  }

  onDone();
};

export const deleteChatMessages = async (id: string) => {
  const { data: res } = await api.delete<ResponseWithData<Chat>>(
    `/api/chat/message/${id}`,
  );
  return res.data;
};
