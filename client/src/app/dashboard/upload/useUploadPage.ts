import useAuth from "@/features/auth/useAuth";
import useDashboard from "@/features/dashboard/useDashboard";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import usageKeys from "@/features/usage/usage.key";
import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UploadFile {
  id: string;
  file: File;
  status: "processing" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const ACCEPTED_FORMATS = [".pdf", ".docx", ".txt"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const useUploadPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  const { dashboardOverview } = useDashboard(user?._id || "");
  const { refetch: overViewRefetch } = dashboardOverview;

  const { foldersByUserPage } = useFolder();
  const { data: folders } = foldersByUserPage(user?._id || "");

  const { createDocumentMutation: createDocument } = useDocument(
    user?._id || "",
  );
  const { mutateAsync } = createDocument;

  const allFolders = folders?.pages.flatMap((page) => page.folders) || [];

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      return `Invalid format. Only ${ACCEPTED_FORMATS.join(", ")} allowed.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 10MB.";
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const filesArray = Array.from(newFiles);
    const validFiles: UploadFile[] = [];

    filesArray.forEach((file) => {
      const error = validateFile(file);
      validFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        status: error ? "error" : "processing",
        progress: 0,
        error: error || undefined,
      });
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadFiles = useCallback(async () => {
    const processingFiles = files.filter((f) => f.status === "processing");
    if (processingFiles.length === 0 || !user?._id) return;

    for (const uploadFile of processingFiles) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "uploading", progress: 0 }
            : f,
        ),
      );

      try {
        // Simulate progress animation
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === uploadFile.id && f.progress < 90) {
                return { ...f, progress: f.progress + 10 };
              }
              return f;
            }),
          );
        }, 200);

        // Prepare document data with user ID
        const documentData: Partial<Doc> & { file: File } = {
          status: "processing" as const,
          user: user._id,
          title: uploadFile.file.name,
          folder: selectedFolder || undefined,
          file: uploadFile.file,
        };

        // Upload document (will upload file first, then create document)
        await mutateAsync(documentData);

        clearInterval(progressInterval);

        // Set to 100% on success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "success", progress: 100 }
              : f,
          ),
        );
        toast.success("Files uploaded successfully!");
      } catch (err) {
        const apiError = err as AxiosError;
        toast.error(apiError.response.data.message);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? {
                  ...f,
                  status: "error",
                  error:
                    apiError.response.data.message || "Failed to upload file",
                }
              : f,
          ),
        );
      }
    }

    // Remove all processed files from the list
    setFiles((prev) => prev.filter((f) => f.status !== "processing"));
    await Promise.all([
      overViewRefetch(),
      queryClient.refetchQueries({
        queryKey: usageKeys.byUserSixMonths(user._id),
      }),
    ]);
  }, [files, selectedFolder, mutateAsync, router, user]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      default:
        return "📎";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const hasValidFiles = files.some((f) => f.status === "processing");
  const hasUploadingFiles = files.some((f) => f.status === "uploading");

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
    isDragging,
    fileInputRef,

    // Folders
    allFolders,
    selectedFolder,
    setSelectedFolder,

    // Files
    files,
    setFiles,
    hasValidFiles,
    hasUploadingFiles,

    // Handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
    removeFile,
    uploadFiles,

    // Formatters
    getFileIcon,
    formatFileSize,
  };
};

export default useUploadPage;
