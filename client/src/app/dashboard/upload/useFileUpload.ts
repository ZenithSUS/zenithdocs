import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useDocument from "@/features/documents/useDocument";
import { useDashboardOverview } from "@/features/dashboard/useDashboardOverview";
import usageKeys from "@/features/usage/usage.key";
import documentKeys from "@/features/documents/document.keys";

import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { UploadFile } from "./upload.types";
import { useDocumentCreate } from "@/features/documents/useDocumentCreate";

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
  const { mutateAsync: createDocument } = createDocumentMutation;

  const { refetch: refetchDashboard } = useDashboardOverview(userId);

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

        await createDocument(documentData);
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
        const data = apiError.response?.data;

        let message = "Failed to upload file";

        // When the server returns validation errors
        if (data?.errors) {
          message = data.errors.map((e) => e.message).join(", ");
          // When the server returns a message
        } else if (data?.message) {
          message = data.message;
        }

        toast.error(message, {
          description: uploadFile.file.name,
        });

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
      queryClient.invalidateQueries({
        queryKey: documentKeys.byUserWithChatPage(userId),
      }),
    ]);
  }, [
    files,
    selectedFolder,
    userId,
    createDocument,
    refetchDashboard,
    queryClient,
    setFiles,
  ]);

  return { uploadFiles };
};

export default useFileUpload;
