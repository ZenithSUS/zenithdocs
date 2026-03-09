import { useState, useRef, useCallback } from "react";
import { UploadFile } from "./upload.types";
import { validateFile } from "./upload.utils";

const useFileDrop = (
  setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const added: UploadFile[] = Array.from(newFiles).map((file) => {
        const error = validateFile(file);
        return {
          id: Math.random().toString(36).substring(7),
          file,
          status: error ? "error" : "processing",
          progress: 0,
          error: error ?? undefined,
        };
      });
      setFiles((prev) => [...prev, ...added]);
    },
    [setFiles],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length > 0) setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
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
      if (e.dataTransfer.files?.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
    },
    [addFiles],
  );

  return {
    isDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
  };
};

export default useFileDrop;
