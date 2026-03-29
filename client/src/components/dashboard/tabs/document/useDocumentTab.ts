import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import useSummary from "@/features/summary/useSummary";
import Doc, { DocumentShareInfo } from "@/types/doc";
import { toast } from "sonner";
import { AxiosError } from "@/types/api";

const useDocumentTab = (userId: string, filterFolder: string) => {
  const router = useRouter();

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [documentToShare, setDocumentToShare] = useState<{
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  } | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const actionsButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { documentsByUserPage, reprocessDocumentMutation } = useDocument(
    userId,
    "",
  );
  const {
    data: documentsData,
    isLoading: documentsLoading,
    fetchNextPage: fetchNextDocPage,
    hasNextPage: hasNextDocPage,
    isFetchingNextPage: isFetchingNextDocPage,
    isError: documentError,
    error: documentErrorData,
    refetch: refetchDocumentChats,
  } = documentsByUserPage;

  const { foldersByUserPage } = useFolder();
  const { data: foldersData, isLoading: foldersLoading } =
    foldersByUserPage(userId);

  const { summariesByUserPage } = useSummary(userId);
  const { data: summariesData } = summariesByUserPage;

  // ─── Mutations ───────────────────────────────────────────────────
  const { mutateAsync: reprocessDoc } = reprocessDocumentMutation;

  // ─── Flattened data ───────────────────────────────────────────────────────
  const allDocs = documentsData?.pages.flatMap((p) => p.documents) ?? [];
  const allFolders = foldersData?.pages.flatMap((p) => p.folders) ?? [];
  const allSummaries = summariesData?.pages.flatMap((p) => p.summaries) ?? [];

  // ─── Client-side filtering ────────────────────────────────────────────────
  let filteredDocs = allDocs.filter((doc) => {
    const docFolderId =
      typeof doc.folder === "object"
        ? doc.folder?._id
        : typeof doc.folder === "string"
          ? doc.folder
          : undefined;

    if (searchQuery) {
      if (!doc.title.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
    }

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
        const DROPDOWN_HEIGHT = 280;
        const DROPDOWN_WIDTH = 192;
        const MARGIN = 8;

        const spaceBelow = window.innerHeight - rect.bottom;
        const top =
          spaceBelow < DROPDOWN_HEIGHT
            ? rect.top + window.scrollY - DROPDOWN_HEIGHT - MARGIN // flip up
            : rect.bottom + window.scrollY + MARGIN; // default down

        const left = Math.min(
          rect.right + window.scrollX - DROPDOWN_WIDTH,
          window.innerWidth + window.scrollX - DROPDOWN_WIDTH - MARGIN,
        );

        setDropdownPosition({ top, left });
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

  const handleReprocessClick = useCallback(
    async (docId: string) => {
      setActionsMenuOpen(null);

      await reprocessDoc(docId).catch((error) => {
        const err = error as AxiosError;
        const data = err.response?.data;

        // When the server returns a validation error
        if (data?.errors) {
          const message = data.errors.map((err) => err.message).join(", ");
          toast.error(message);
        } else {
          // When the server returns a generic error
          toast.error(data?.message || "Error reprocessing document");
        }
      });
    },
    [reprocessDoc, setActionsMenuOpen],
  );

  const handleShareClick = useCallback(
    ({ id, title, fileUrl, fileSize, fileType }: DocumentShareInfo) => {
      setDocumentToShare({ id, title, fileUrl, fileSize, fileType });
      setActionsMenuOpen(null);
      setShareModalOpen(true);
    },
    [setActionsMenuOpen],
  );

  const handleDeleteSuccess = () => {
    if (selectedDoc?._id === documentToDelete?.id) setSelectedDoc(null);
    setDocumentToDelete(null);
  };

  const handleMoveSuccess = () => setDocumentToMove(null);

  const handleShareSuccess = () => setDocumentToShare(null);

  const handleNavigate = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActionsMenuOpen(null);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isNavigating) return;

      setSearchQuery(e.target.value);
    },
    [isNavigating],
  );

  return {
    // Loading
    documentsLoading,
    foldersLoading,

    // Data
    allDocs,
    allFolders,
    allSummaries,
    filteredDocs,
    documentErrorData,

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
    documentToShare,
    moveModalOpen,
    shareModalOpen,
    deleteModalOpen,
    documentError,

    // Setters
    setFilterStatus,
    setSelectedDoc,
    setActionsMenuOpen,
    setMoveModalOpen,
    setShareModalOpen,
    setDeleteModalOpen,

    // Handlers
    handleNavigate,
    handleMoveClick,
    handleDeleteClick,
    handleDeleteSuccess,
    handleMoveSuccess,
    handleShareSuccess,
    handleReprocessClick,
    handleShareClick,
    handleSearch,
    fetchNextDocPage,
    refetchDocumentChats,

    // Refs
    actionsButtonRefs,
    loadMoreRef,
  };
};

export default useDocumentTab;
