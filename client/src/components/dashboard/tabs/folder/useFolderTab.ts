import useFolder from "@/features/folder/useFolder";
import useDocument from "@/features/documents/useDocument";
import { useEffect, useRef } from "react";

const useFolderTab = (userId: string) => {
  const { foldersByUserPage } = useFolder();
  const {
    data: foldersData,
    fetchNextPage: fetchNextFolderPage,
    hasNextPage: hasNextFolderPage,
    isFetchingNextPage: isFetchingNextFolderPage,
    isLoading: foldersLoading,
  } = foldersByUserPage(userId);

  const { documentsByUserPage } = useDocument(userId);
  const { data: documentsData, isLoading: documentsLoading } =
    documentsByUserPage;

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

  // Flatten all pages
  const allFolders = foldersData?.pages.flatMap((page) => page.folders) || [];
  const allDocuments =
    documentsData?.pages.flatMap((page) => page.documents) || [];

  // Helper to get documents for a specific folder
  const getDocsForFolder = (folderFilter: string) => {
    return allDocuments.filter((d) => {
      const folderId =
        typeof d.folder === "object"
          ? d.folder?._id
          : typeof d.folder === "string"
            ? d.folder
            : null;

      return folderId === folderFilter;
    });
  };

  // Helper to get unfiled documents
  const unfiledDocs = allDocuments.filter((d) => !d.folder);

  return {
    // Loading states
    foldersLoading,
    documentsLoading,

    // Data
    allFolders,
    unfiledDocs,

    // States
    hasNextFolderPage,
    isFetchingNextFolderPage,

    // Actions
    getDocsForFolder,
    fetchNextFolderPage,

    // Ref
    loadMoreRef,
  };
};

export default useFolderTab;
