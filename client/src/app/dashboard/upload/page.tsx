"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import useAuth from "@/features/auth/useAuth";
import useFolder from "@/features/folder/useFolder";
import useDocument from "@/features/documents/useDocument";
import useDashboard from "@/features/dashboard/useDashboard";
import Doc from "@/types/doc";
import { toast } from "sonner";
import { AxiosError } from "@/types/api";

interface UploadFile {
  id: string;
  file: File;
  status: "processing" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const ACCEPTED_FORMATS = [".pdf", ".docx", ".txt"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadPage() {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const { me } = useAuth();
  const { data: user } = me;

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
    await overViewRefetch();
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

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif overflow-hidden">
      <CursorGlow mousePos={mousePos} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
            >
              ← BACK
            </button>
            <div className="h-5 w-px bg-[#F5F5F5]/10" />
            <h1 className="text-lg font-bold tracking-[0.08em] font-serif">
              UPLOAD <span className="text-[#C9A227]">DOCUMENTS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Folder Selection */}
        <div className="mb-8">
          <label className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-3 block font-sans">
            SELECT FOLDER (OPTIONAL)
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full sm:w-64 px-4 py-3 bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded text-[#F5F5F5] text-sm font-sans focus:outline-none focus:border-[#C9A227]/40 transition-colors"
          >
            <option value="">No Folder</option>
            {allFolders.map((folder) => (
              <option key={folder._id} value={folder._id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
            isDragging
              ? "border-[#C9A227] bg-[#C9A227]/5 scale-[1.02]"
              : "border-[#C9A227]/30 bg-[rgba(31,41,55,0.2)] hover:border-[#C9A227]/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_FORMATS.join(",")}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="px-8 py-16 sm:py-20 text-center">
            <div className="text-5xl sm:text-6xl mb-6 animate-pulse">📁</div>
            <h2 className="text-xl sm:text-2xl font-normal mb-3 font-serif">
              Drop your files here
            </h2>
            <p className="text-sm text-[#F5F5F5]/55 mb-6 font-sans">
              or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-[#C9A227] text-[#111111] rounded-sm text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,162,39,0.3)]"
            >
              BROWSE FILES
            </button>
            <div className="mt-6 text-[11px] text-[#F5F5F5]/40 tracking-[0.08em] font-sans">
              SUPPORTED: {ACCEPTED_FORMATS.join(", ").toUpperCase()} • MAX 10MB
            </div>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] font-sans">
                FILES ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-[11px] tracking-[0.12em] text-[#F5F5F5]/50 hover:text-[#F5F5F5] transition-colors font-sans"
              >
                CLEAR ALL
              </button>
            </div>

            <div className="space-y-3">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-4 transition-all duration-300 hover:border-[#C9A227]/25"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl shrink-0">
                      {getFileIcon(uploadFile.file.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-normal truncate font-serif">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-[11px] text-[#F5F5F5]/40 font-sans">
                            {formatFileSize(uploadFile.file.size)}
                          </p>
                        </div>

                        {uploadFile.status === "processing" && (
                          <button
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-[#F5F5F5]/40 hover:text-[#ef4444] transition-colors shrink-0"
                          >
                            ✕
                          </button>
                        )}

                        {uploadFile.status === "success" && (
                          <span className="text-[#10b981] text-sm shrink-0">
                            ✓
                          </span>
                        )}

                        {uploadFile.status === "error" && (
                          <span className="text-[#ef4444] text-sm shrink-0">
                            ⚠
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {uploadFile.status === "uploading" && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C9A227] transition-all duration-300 rounded-full"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-[#F5F5F5]/40 mt-1 font-sans">
                            {uploadFile.progress}%
                          </p>
                        </div>
                      )}

                      {/* Error Message */}
                      {uploadFile.error && (
                        <p className="text-[11px] text-[#ef4444] mt-2 font-sans">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={uploadFiles}
              disabled={!hasValidFiles || hasUploadingFiles || !user}
              className={`flex-1 sm:flex-initial px-10 py-4 rounded-sm text-[13px] font-bold tracking-[0.12em] font-sans transition-all duration-200 ${
                hasValidFiles && !hasUploadingFiles && user
                  ? "bg-[#C9A227] text-[#111111] hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.35)]"
                  : "bg-[#C9A227]/30 text-[#111111]/50 cursor-not-allowed"
              }`}
            >
              {hasUploadingFiles ? "UPLOADING..." : "START UPLOAD →"}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 sm:flex-initial px-10 py-4 bg-transparent border border-[#F5F5F5]/15 text-[#F5F5F5] rounded-sm text-[13px] tracking-[0.12em] font-sans transition-all duration-200 hover:border-[#F5F5F5]/40"
            >
              CANCEL
            </button>
          </div>
        )}
      </main>

      <style>{`
        select option {
          background: #1f2937;
          color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
