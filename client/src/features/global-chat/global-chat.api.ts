import config from "@/config/env";
import { api, authApi } from "@/lib/axios";
import { RefreshTokenResponse, ResponseWithData } from "@/types/api";
import { GlobalChat } from "@/types/global-chat";

export const initGlobalChatForUser = async () => {
  const { data: res } = await api.post<ResponseWithData<GlobalChat>>(
    "/api/global-chats/init",
  );

  return res.data;
};

export const createGlobalChatStream = async (
  question: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
): Promise<void> => {
  const token = localStorage.getItem("accessToken") as string;

  const response = await fetch(`${config.api.baseUrl}/api/global-chats`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": config.api.key,
    },
    body: JSON.stringify({ question }),
  });

  // Handle token errors via x-auth-error header
  if (!response.ok) {
    const authError = response.headers.get("x-auth-error");

    const isTokenError =
      authError === "missing_token" ||
      authError === "token_expired" ||
      authError === "invalid_token";

    if (isTokenError) {
      // Trigger refresh via your route handler, then retry
      const refreshRes =
        await authApi.post<RefreshTokenResponse>("/api/auth/refresh");

      // Set the new token
      const newToken = refreshRes.data.data.accessToken;
      localStorage.setItem("accessToken", newToken);

      if (!newToken) throw new Error("Session expired");

      // Retry the stream with the new token
      return createGlobalChatStream(question, onChunk, onDone);
    }

    throw new Error("Failed to send message");
  }

  if (!response.body) throw new Error("No stream body");

  const reader = response.body.getReader();

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const text = line.slice(6);

      if (text === "[DONE]") {
        onDone();
        return;
      }

      const decoded = text.replace(/\\n/g, "\n");
      onChunk(decoded);
    }
  }

  if (buffer.startsWith("data: ")) {
    const text = buffer.slice(6);
    if (text && text !== "[DONE]") onChunk(text);
  }

  onDone();
};

export const fetchGlobalChatByUser = async (userId: string) => {
  const { data: res } = await api.get<ResponseWithData<GlobalChat>>(
    `/api/global-chats/user/${userId}`,
  );

  return res.data;
};

export const deleteGlobalChatByUser = async (userId: string) => {
  const { data: res } = await api.delete<ResponseWithData<GlobalChat>>(
    `/api/global-chats/user/${userId}`,
  );
  return res.data;
};
