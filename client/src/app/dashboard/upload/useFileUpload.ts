import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useDocument from "@/features/documents/useDocument";
import useDashboard from "@/features/dashboard/useDashboard";
import usageKeys from "@/features/usage/usage.key";
import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { UploadFile } from "./upload.types";

interface UseFileUploadOptions {
  userId: string;
  selectedFolder: string;
  files: UploadFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const useFileUpload = ({
  userId,
  selectedFolder,
  files,
  setFiles,
}: UseFileUploadOptions) => {
  const queryClient = useQueryClient();

  const { createDocumentMutation } = useDocument(userId);
  const { mutateAsync } = createDocumentMutation;

  const { dashboardOverview } = useDashboard(userId);
  const { refetch: refetchDashboard } = dashboardOverview;

  const uploadFiles = useCallback(async () => {
    const pending = files.filter((f) => f.status === "processing");
    if (pending.length === 0 || !userId) return;

    for (const uploadFile of pending) {
      // Mark as uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: "uploading", progress: 0 }
            : f,
        ),
      );

      try {
        // Simulate progress
        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f,
            ),
          );
        }, 200);

        const documentData: Partial<Doc> & { file: File } = {
          status: "processing",
          user: userId,
          title: uploadFile.file.name,
          folder: selectedFolder || undefined,
          file: uploadFile.file,
        };

        await mutateAsync(documentData);
        clearInterval(interval);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "success", progress: 100 }
              : f,
          ),
        );
        toast.success("File uploaded successfully!");
      } catch (err) {
        const apiError = err as AxiosError;
        const message =
          apiError.response?.data?.message ?? "Failed to upload file";
        toast.error(message);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", error: message }
              : f,
          ),
        );
      }
    }

    // Clear successfully processed files
    setFiles((prev) => prev.filter((f) => f.status !== "processing"));

    await Promise.all([
      refetchDashboard(),
      queryClient.refetchQueries({
        queryKey: usageKeys.byUserSixMonths(userId),
      }),
    ]);
  }, [
    files,
    selectedFolder,
    userId,
    mutateAsync,
    refetchDashboard,
    queryClient,
    setFiles,
  ]);

  return { uploadFiles };
};

export default useFileUpload;
