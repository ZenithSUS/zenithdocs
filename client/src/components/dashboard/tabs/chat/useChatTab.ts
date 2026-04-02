import useDocument from "@/features/documents/useDocument";
import { useDocumentByUserWithChatsPage } from "@/features/documents/useDocumentByUserWithChatsPage";

interface useChatTabProps {
  userId: string;
}

const useChatTab = ({ userId }: useChatTabProps) => {
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
