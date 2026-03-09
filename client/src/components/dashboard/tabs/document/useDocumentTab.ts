import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import useSummary from "@/features/summary/useSummary";
import Doc from "@/types/doc";

const useDocumentTab = (userId: string, filterFolder: string) => {
  const router = useRouter();

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Doc["status"] | "all">(
    "all",
  );
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [documentToMove, setDocumentToMove] = useState<{
    id: string;
    title: string;
    folderId?: string | null;
  } | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const actionsButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { documentsByUserPage } = useDocument(userId, "");
  const {
    data: documentsData,
    isLoading: documentsLoading,
    fetchNextPage: fetchNextDocPage,
    hasNextPage: hasNextDocPage,
    isFetchingNextPage: isFetchingNextDocPage,
  } = documentsByUserPage;

  const { foldersByUserPage } = useFolder();
  const { data: foldersData, isLoading: foldersLoading } =
    foldersByUserPage(userId);

  const { summariesByUserPage } = useSummary(userId);
  const { data: summariesData } = summariesByUserPage;

  // ─── Flattened data ───────────────────────────────────────────────────────
  const allDocs = documentsData?.pages.flatMap((p) => p.documents) ?? [];
  const allFolders = foldersData?.pages.flatMap((p) => p.folders) ?? [];
  const allSummaries = summariesData?.pages.flatMap((p) => p.summaries) ?? [];

  // ─── Client-side filtering ────────────────────────────────────────────────
  const filteredDocs = allDocs.filter((doc) => {
    const docFolderId =
      typeof doc.folder === "object"
        ? doc.folder?._id
        : typeof doc.folder === "string"
          ? doc.folder
          : undefined;

    if (filterFolder !== "all") {
      if (filterFolder === "") {
        if (docFolderId) return false;
      } else {
        if (docFolderId !== filterFolder) return false;
      }
    }
    if (filterStatus !== "all" && doc.status !== filterStatus) return false;
    return true;
  });

  // ─── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideButton = Array.from(actionsButtonRefs.current.values()).some(
        (btn) => btn?.contains(target),
      );
      const dropdown = document.getElementById("actions-dropdown-menu");
      if (!insideButton && !dropdown?.contains(target)) {
        setActionsMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Update dropdown position ─────────────────────────────────────────────
  useEffect(() => {
    if (actionsMenuOpen && actionsButtonRefs.current.has(actionsMenuOpen)) {
      const button = actionsButtonRefs.current.get(actionsMenuOpen);
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 192,
        });
      }
    } else {
      setDropdownPosition(null);
    }
  }, [actionsMenuOpen]);

  // ─── Infinite scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextDocPage || isFetchingNextDocPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextDocPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.unobserve(el); // captures el, not the ref
  }, [hasNextDocPage, isFetchingNextDocPage, fetchNextDocPage]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleDeleteClick = (docId: string, docTitle: string) => {
    setDocumentToDelete({ id: docId, title: docTitle });
    setDeleteModalOpen(true);
    setActionsMenuOpen(null);
  };

  const handleMoveClick = (
    docId: string,
    docTitle: string,
    folderId?: string | null,
  ) => {
    setDocumentToMove({ id: docId, title: docTitle, folderId });
    setMoveModalOpen(true);
    setActionsMenuOpen(null);
  };

  const handleDeleteSuccess = () => {
    if (selectedDoc?._id === documentToDelete?.id) setSelectedDoc(null);
    setDocumentToDelete(null);
  };

  const handleMoveSuccess = () => setDocumentToMove(null);

  const handleNavigate = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActionsMenuOpen(null);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return {
    // Loading
    documentsLoading,
    foldersLoading,

    // Data
    allDocs,
    allFolders,
    allSummaries,
    filteredDocs,

    // State
    selectedDoc,
    actionsMenuOpen,
    filterStatus,
    isFetchingNextDocPage,
    hasNextDocPage,
    isNavigating,
    dropdownPosition,
    documentToDelete,
    documentToMove,
    moveModalOpen,
    deleteModalOpen,

    // Setters
    setFilterStatus,
    setSelectedDoc,
    setActionsMenuOpen,
    setMoveModalOpen,
    setDeleteModalOpen,

    // Handlers
    handleNavigate,
    handleMoveClick,
    handleDeleteClick,
    handleDeleteSuccess,
    handleMoveSuccess,
    fetchNextDocPage,

    // Refs
    actionsButtonRefs,
    loadMoreRef,
  };
};

export default useDocumentTab;
