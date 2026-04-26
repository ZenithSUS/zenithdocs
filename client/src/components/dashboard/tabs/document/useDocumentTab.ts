import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import useDocument from "@/features/documents/useDocument";
import Doc, { DocumentShareInfo } from "@/types/doc";
import { toast } from "sonner";
import { AxiosError } from "@/types/api";
import { useDocumentByUserPage } from "@/features/documents/useDocumentByUserPage";
import { useFolderByUserPage } from "@/features/folder/useFolderByUserPage";
import { useSummaryByUserPage } from "@/features/summary/useSummaryByUserPage";

const useDocumentTab = (userId: string, filterFolder: string) => {
  const router = useRouter();

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);
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
  const folderDropdownRef = useRef<HTMLDivElement>(null);

  // ─── Queries ──────────────────────────────────────────────────────────────
  const { reprocessDocumentMutation } = useDocument(userId);
  const {
    data: documentsData,
    isLoading: documentsLoading,
    fetchNextPage: fetchNextDocPage,
    hasNextPage: hasNextDocPage,
    isFetchingNextPage: isFetchingNextDocPage,
    isError: documentError,
    error: documentErrorData,
    refetch: refetchDocument,
  } = useDocumentByUserPage(userId);

  const {
    data: foldersData,
    isLoading: foldersLoading,
    fetchNextPage: fetchNextFolderPage,
    hasNextPage: hasNextFolderPage,
    isFetchingNextPage: isFetchingNextFolderPage,
    isError: folderError,
    error: folderErrorData,
    refetch: refetchFolder,
  } = useFolderByUserPage(userId);

  const {
    data: summariesData,
    refetch: refetchSummary,
    isLoading: summariesLoading,
    isError: summaryError,
    error: summaryErrorData,
  } = useSummaryByUserPage(userId);

  // ─── Mutations ───────────────────────────────────────────────────
  const { mutateAsync: reprocessDoc } = reprocessDocumentMutation;

  // ─── Flattened data ───────────────────────────────────────────────────────
  const allDocs = useMemo(() => {
    const docs = documentsData?.pages.flatMap((p) => p.documents) ?? [];
    const seen = new Set<string>();
    return docs.filter((doc) => {
      if (seen.has(doc._id)) return false;
      seen.add(doc._id);
      return true;
    });
  }, [documentsData]);
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

  /// ─── Combined states ──────────────────────────────────────────────────────
  const documentTabError = documentError || folderError || summaryError;
  const documentTabErrorData =
    documentErrorData || folderErrorData || summaryErrorData;
  const documentTabLoading =
    documentsLoading || foldersLoading || summariesLoading;

  const refetchDocumentTab = useCallback(async () => {
    await Promise.all([refetchDocument(), refetchFolder(), refetchSummary()]);
  }, [refetchDocument, refetchFolder, refetchSummary]);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!folderDropdownRef.current?.contains(e.target as Node)) {
        setFolderDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return {
    // Loading
    documentTabLoading,
    isFetchingNextDocPage,
    isFetchingNextFolderPage,
    hasNextDocPage,
    hasNextFolderPage,
    isNavigating,

    // Data
    allDocs,
    filteredDocs,
    allFolders,
    allSummaries,

    // Error
    documentTabError,
    documentTabErrorData,

    // State
    selectedDoc,
    filterStatus,
    dropdownPosition,
    actionsMenuOpen,
    folderDropdownOpen,

    documentToDelete,
    documentToMove,
    documentToShare,

    moveModalOpen,
    shareModalOpen,
    deleteModalOpen,

    // Setters
    setFilterStatus,
    setSelectedDoc,
    setActionsMenuOpen,
    setMoveModalOpen,
    setShareModalOpen,
    setDeleteModalOpen,
    setFolderDropdownOpen,

    // Handlers
    handleNavigate,
    handleSearch,
    handleReprocessClick,

    handleMoveClick,
    handleDeleteClick,
    handleShareClick,

    handleDeleteSuccess,
    handleMoveSuccess,
    handleShareSuccess,

    fetchNextDocPage,
    fetchNextFolderPage,
    refetchDocumentTab,

    // Refs
    actionsButtonRefs,
    loadMoreRef,
    folderDropdownRef,
  };
};

export default useDocumentTab;
