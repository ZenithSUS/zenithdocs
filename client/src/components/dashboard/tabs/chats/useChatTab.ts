import useDocument from "@/features/documents/useDocument";

interface useChatTabProps {
  userId: string;
}

const useChatTab = ({ userId }: useChatTabProps) => {
  const { documentsByUserWithChatsPage } = useDocument(userId);
  const {
    data: documentsWithChats,
    hasNextPage: hasNextDocumentPage,
    isLoading: documentLoading,
    fetchNextPage: fetchNextDocumentPage,
    isFetchingNextPage: isFetchingNextDocumentPage,
    isError: documentError,
    error: documentErrorData,
    refetch: refetchDocumentChats,
  } = documentsByUserWithChatsPage;

  const allDocumentChats =
    documentsWithChats?.pages.flatMap((page) => page.documents) ?? [];

  return {
    allDocumentChats,
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
