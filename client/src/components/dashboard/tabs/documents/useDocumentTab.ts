import { useState, useEffect, useRef } from "react";
import useDocument from "@/features/documents/useDocument";
import useFolder from "@/features/folder/useFolder";
import useSummary from "@/features/summary/useSummary";
import { useRouter } from "next/navigation";
import Doc from "@/types/doc";

const useDocumentTab = (userId: string, filterFolder: string) => {
  const router = useRouter();

  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [documentToMove, setDocumentToMove] = useState<{
    id: string;
    title: string;
    folderId?: string | null;
  } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<Doc["status"] | "all">(
    "all",
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const actionsButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // Check if click is inside any actions button or the dropdown menu
      const clickedInsideButton = Array.from(
        actionsButtonRefs.current.values(),
      ).some((button) => button && button.contains(target));

      const dropdownMenu = document.getElementById("actions-dropdown-menu");
      const clickedInsideDropdown =
        dropdownMenu && dropdownMenu.contains(target);

      if (!clickedInsideButton && !clickedInsideDropdown) {
        setActionsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position when menu opens
  useEffect(() => {
    if (actionsMenuOpen && actionsButtonRefs.current.has(actionsMenuOpen)) {
      const button = actionsButtonRefs.current.get(actionsMenuOpen);
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 192, // 192px = w-48
        });
      }
    } else {
      setDropdownPosition(null);
    }
  }, [actionsMenuOpen]);

  // Fetch documents with pagination
  const { documentsByUserPage } = useDocument(userId, "");
  const {
    data: documentsData,
    isLoading: documentsLoading,
    fetchNextPage: fetchNextDocPage,
    hasNextPage: hasNextDocPage,
    isFetchingNextPage: isFetchingNextDocPage,
  } = documentsByUserPage;

  // Fetch folders for dropdown
  const { foldersByUserPage } = useFolder();
  const { data: foldersData, isLoading: foldersLoading } =
    foldersByUserPage(userId);

  // Fetch summaries for expanded view
  const { summariesByUserPage } = useSummary(userId);
  const { data: summariesData } = summariesByUserPage;

  // Flatten paginated data
  const allDocs = documentsData?.pages.flatMap((page) => page.documents) ?? [];
  const allFolders = foldersData?.pages.flatMap((page) => page.folders) ?? [];
  const allSummaries =
    summariesData?.pages.flatMap((page) => page.summaries) ?? [];

  // Client-side filtering
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

    if (filterStatus !== "all" && doc.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // Handle delete click
  const handleDeleteClick = (docId: string, docTitle: string) => {
    setDocumentToDelete({ id: docId, title: docTitle });
    setDeleteModalOpen(true);
    setActionsMenuOpen(null);
  };

  // Handle move click
  const handleMoveClick = (
    docId: string,
    docTitle: string,
    folderId?: string | null,
  ) => {
    setDocumentToMove({ id: docId, title: docTitle, folderId });
    setMoveModalOpen(true);
    setActionsMenuOpen(null);
  };

  // Handle successful deletion
  const handleDeleteSuccess = () => {
    if (selectedDoc?._id === documentToDelete?.id) {
      setSelectedDoc(null);
    }
    setDocumentToDelete(null);
  };

  // Handle successful move
  const handleMoveSuccess = () => {
    setDocumentToMove(null);
  };

  // Handle navigation with blocking
  const handleNavigate = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActionsMenuOpen(null);
    router.push(path);
    setTimeout(() => setIsNavigating(false), 1000);
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextDocPage || isFetchingNextDocPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextDocPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextDocPage, isFetchingNextDocPage, fetchNextDocPage]);

  return {
    // Misc
    router,

    // Loading States
    documentsLoading,
    foldersLoading,

    // States
    selectedDoc,
    actionsMenuOpen,
    filterStatus,
    filteredDocs,
    isFetchingNextDocPage,
    hasNextDocPage,
    isNavigating,
    dropdownPosition,
    documentToDelete,
    documentToMove,
    moveModalOpen,
    deleteModalOpen,

    // Data
    allDocs,
    allFolders,
    allSummaries,

    // Actions
    setFilterStatus,
    setSelectedDoc,
    setActionsMenuOpen,
    setMoveModalOpen,
    setDeleteModalOpen,
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
