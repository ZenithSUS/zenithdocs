import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import useMousePosition from "@/features/ui/useMousePostion";

import { UploadFile } from "./upload.types";
import useFileDrop from "./useFileDrop";
import useFileUpload from "./useFileUpload";
import useRetryStore from "@/store/useRetryStore";
import { useFolderByUserPage } from "@/features/folder/useFolderByUserPage";
import { useAuthMe } from "@/features/auth/useAuthMe";

const useUploadPage = () => {
  const router = useRouter();
  const mousePos = useMousePosition();

  const { retries, increment } = useRetryStore();
  const pageRetries = retries["upload-page"] ?? 0;

  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = useAuthMe();

  // ─── Folders ──────────────────────────────────────────────────────────────
  const { data: folders } = useFolderByUserPage(user?._id ?? "");
  const allFolders = folders?.pages.flatMap((page) => page.folders) ?? [];

  // ─── File drop ────────────────────────────────────────────────────────────
  const drop = useFileDrop(setFiles);

  // ─── File upload ──────────────────────────────────────────────────────────
  const { uploadFiles } = useFileUpload({
    userId: user?._id ?? "",
    selectedFolder,
    files,
    setFiles,
  });

  // ─── Derived ──────────────────────────────────────────────────────────────
  const hasValidFiles = files.some((f) => f.status === "processing");
  const hasUploadingFiles = files.some((f) => f.status === "uploading");
  const anyFileSuccess = files.some((f) => f.status === "success");

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const retryUser = () => {
    increment("upload-page");
    refetchUser().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("upload-page");
      }
    });
  };

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,

    // Navigation
    router,

    // UI
    mousePos,
    chatBotOpen,
    setChatBotOpen,

    // Folders
    allFolders,
    selectedFolder,
    setSelectedFolder,

    // Files
    files,
    setFiles,
    removeFile,
    hasValidFiles,
    hasUploadingFiles,
    anyFileSuccess,

    // Drop (spread so page binds handlers directly)
    ...drop,

    // Upload
    uploadFiles,

    // Retries
    pageRetries,
    retryUser,
  };
};

export default useUploadPage;
