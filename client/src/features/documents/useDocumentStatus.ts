import config from "@/config/env";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import { updateInfiniteDocumentStatus } from "./document.cache";
import { toast } from "sonner";
import useAuthStore from "../auth/auth.store";
import { dashboardKeys } from "../dashboard/dashboard.keys";

interface DocStatus {
  documentId: string;
  status: "uploaded" | "processing" | "completed" | "failed";
}

const useDocumentStatus = () => {
  const queryClient = useQueryClient();
  const documentLimit = 10;

  const [socketReady, setSocketReady] = useState(false);
  const { userId, accessToken } = useAuthStore();

  useEffect(() => {
    if (!userId || !accessToken || !config.api.baseUrl) return;

    const socket = io(config.api.baseUrl, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5, // stop retrying after 5 attempts
      reconnectionDelay: 2000, // wait 2s between attempts
      timeout: 10000, // fail connection after 10s
    });

    socket.on("connect", () => {
      socket.emit("join", userId, () => {
        setSocketReady(true);
      });
    });

    // --- Connection error handlers ---
    socket.on("connect_error", () => {
      if (socket.io.reconnectionAttempts() === 5) {
        toast.error("Real-time updates unavailable. Please refresh.");
      }
    });

    socket.on("disconnect", (reason: string) => {
      setSocketReady(false);
      if (reason === "io server disconnect") {
        toast.warning("Connection lost. Reconnecting...");
        socket.connect(); // manually reconnect since socket.io won't retry
      }
    });

    socket.on("reconnect", () => {
      socket.emit("join", userId, () => {
        setSocketReady(true);
      });
    });

    socket.on("reconnect_failed", () => {
      toast.error("Could not reconnect. Please refresh the page.");
    });

    // --- Document event handlers ---
    socket.on("document:processing", (data: DocStatus) => {
      updateInfiniteDocumentStatus(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        data,
      );
      queryClient.refetchQueries({ queryKey: dashboardKeys.overview() });
    });

    socket.on("document:completed", (data: DocStatus) => {
      updateInfiniteDocumentStatus(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        data,
      );
      queryClient.refetchQueries({ queryKey: dashboardKeys.overview() });
      toast.success("Document processed successfully!");
    });

    socket.on("document:failed", (data: DocStatus) => {
      updateInfiniteDocumentStatus(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        data,
      );
      queryClient.refetchQueries({ queryKey: dashboardKeys.overview() });
      toast.error("Document processing failed!");
    });

    return () => {
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("reconnect_failed");
      socket.off("document:processing");
      socket.off("document:completed");
      socket.off("document:failed");
      socket.disconnect();
    };
  }, [userId, accessToken]);

  return { socketReady };
};

export default useDocumentStatus;
