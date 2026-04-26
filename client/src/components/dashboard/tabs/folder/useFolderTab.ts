import { useEffect, useRef } from "react";
import { useFolderByUserPage } from "@/features/folder/useFolderByUserPage";
import { useDocumentUnifiedByUser } from "@/features/documents/useDocumentUnifiedByUser";

const useFolderTab = (userId: string) => {
  const {
    data: foldersData,
    fetchNextPage: fetchNextFolderPage,
    hasNextPage: hasNextFolderPage,
    isFetchingNextPage: isFetchingNextFolderPage,
    isLoading: foldersLoading,
    isError: foldersError,
    error: foldersErrorData,
    refetch: refetchFolders,
  } = useFolderByUserPage(userId);

  const {
    data: unifiedDocuments,
    isLoading: unifiedDocumentsLoading,
    isError: unifiedDocumentsError,
    error: unifiedDocumentsErrorData,
    refetch: refetchUnifiedDocuments,
  } = useDocumentUnifiedByUser(userId);

  // Intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextFolderPage || isFetchingNextFolderPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextFolderPage();
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
  }, [hasNextFolderPage, isFetchingNextFolderPage, fetchNextFolderPage]);

  const allFolders = foldersData?.pages.flatMap((page) => page.folders) || [];
  const unifiedDocumentsData = unifiedDocuments || { documents: [], total: 0 };

  const refetchFoldersAndDocuments = () => {
    refetchFolders().then(() => refetchUnifiedDocuments());
  };

  const isFolderTabError = foldersError || unifiedDocumentsError;
  const foldersTabError = foldersErrorData || unifiedDocumentsErrorData;

  return {
    // Loading states
    foldersLoading,
    unifiedDocumentsLoading,

    // Data
    allFolders,
    unifiedDocuments: unifiedDocumentsData.documents,
    unifiedDocumentsTotal: unifiedDocumentsData.total,

    // States
    hasNextFolderPage,
    isFetchingNextFolderPage,

    // Errors
    isFolderTabError,
    foldersTabError,

    // Refetch
    refetchFoldersAndDocuments,

    // Actions

    fetchNextFolderPage,

    // Ref
    loadMoreRef,
  };
};

export default useFolderTab;
