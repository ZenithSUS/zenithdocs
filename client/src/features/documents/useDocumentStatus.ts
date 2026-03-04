import config from "@/config/env";
import { useEffect } from "react";
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

  const { userId, accessToken } = useAuthStore();

  useEffect(() => {
    // Don't connect until auth is ready
    if (!userId || !accessToken || !config.api.baseUrl) return;

    const socket = io(config.api.baseUrl, {
      auth: { token: accessToken },
    });

    socket.emit("join", userId);

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
      socket.off("document:processing");
      socket.off("document:completed");
      socket.off("document:failed");
    };
  }, [userId]);
};

export default useDocumentStatus;
