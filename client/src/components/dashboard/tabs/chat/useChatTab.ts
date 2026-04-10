import { useState, useMemo } from "react";
import { useDocumentByUserWithChatsPage } from "@/features/documents/useDocumentByUserWithChatsPage";

interface useChatTabProps {
  userId: string;
}

const useChatTab = ({ userId }: useChatTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: documentsWithChats,
    hasNextPage: hasNextDocumentPage,
    isLoading: documentLoading,
    fetchNextPage: fetchNextDocumentPage,
    isFetchingNextPage: isFetchingNextDocumentPage,
    isError: documentError,
    error: documentErrorData,
    refetch: refetchDocumentChats,
  } = useDocumentByUserWithChatsPage(userId);

  const allDocumentChats = useMemo(
    () => documentsWithChats?.pages.flatMap((page) => page.documents) ?? [],
    [documentsWithChats],
  );

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allDocumentChats;
    return allDocumentChats.filter((doc) =>
      doc.title?.toLowerCase().includes(q),
    );
  }, [allDocumentChats, searchQuery]);

  return {
    allDocumentChats: filteredChats,
    searchQuery,
    setSearchQuery,
    hasNextDocumentPage,
    fetchNextDocumentPage,
    isFetchingNextDocumentPage,
    documentLoading,
    documentError,
    documentErrorData,
    refetchDocumentChats,
  };
};

export default useChatTab;
