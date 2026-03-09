import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/features/auth/useAuth";
import useFolder from "@/features/folder/useFolder";
import useMousePosition from "@/features/ui/useMousePostion";

import { UploadFile } from "./upload.types";
import useFileDrop from "./useFileDrop";
import useFileUpload from "./useFileUpload";

const useUploadPage = () => {
  const router = useRouter();
  const mousePos = useMousePosition();

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  // ─── Folders ──────────────────────────────────────────────────────────────
  const { foldersByUserPage } = useFolder();
  const { data: folders } = foldersByUserPage(user?._id ?? "");
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

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Navigation
    router,

    // UI
    mousePos,

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

    // Drop (spread so page binds handlers directly)
    ...drop,

    // Upload
    uploadFiles,
  };
};

export default useUploadPage;
