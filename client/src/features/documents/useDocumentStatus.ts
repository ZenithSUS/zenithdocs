import config from "@/config/env";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import {
  updateDocumentStatus,
  updateInfiniteDocumentStatus,
} from "./document.cache";
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

    let attemptCount = 0;

    const socket = io(config.api.baseUrl, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    // --- Connection handlers ---
    socket.on("connect", () => {
      attemptCount = 0;
      socket.emit("join", userId, () => {
        setSocketReady(true);
      });
    });

    socket.on("connect_error", () => {
      attemptCount++;
      if (attemptCount === 3) {
        toast.warning("Having trouble connecting. Retrying...");
      }
    });

    socket.on("disconnect", (reason: string) => {
      setSocketReady(false);
      if (reason === "io server disconnect") {
        toast.warning("Connection lost. Reconnecting...");
        socket.connect();
      }
    });

    socket.on("reconnect", () => {
      attemptCount = 0;
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
      updateDocumentStatus(
        queryClient,
        documentKeys.byId(data.documentId),
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
      updateDocumentStatus(
        queryClient,
        documentKeys.byId(data.documentId),
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
      updateDocumentStatus(
        queryClient,
        documentKeys.byId(data.documentId),
        data,
      );
      queryClient.refetchQueries({ queryKey: dashboardKeys.overview() });
      toast.error("Document processing failed!");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("reconnect");
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
