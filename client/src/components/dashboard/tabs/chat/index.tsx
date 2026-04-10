import { useRef, useEffect } from "react";
import { FolderOpen, Search, X } from "lucide-react";

import ChatCard from "@/components/dashboard/cards/ChatCard";
import useChatTab from "./useChatTab";
import { ThreeDot } from "react-loading-indicators";
import DocumentChatLoading from "./components/DocumentChatLoading";
import EmptyDocumentChats from "./components/EmptyDocumentChats";
import SearchBar from "../../SearchBar";

interface ChatsTabProps {
  userId: string;
}

function ChatsTab({ userId }: ChatsTabProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    allDocumentChats,
    searchQuery,
    setSearchQuery,
    hasNextDocumentPage,
    fetchNextDocumentPage,
    isFetchingNextDocumentPage,
    documentLoading,
    documentError,
    refetchDocumentChats,
  } = useChatTab({ userId });

  useEffect(() => {
    if (
      !loadMoreRef.current ||
      !hasNextDocumentPage ||
      isFetchingNextDocumentPage
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextDocumentPage();
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
  }, [hasNextDocumentPage, isFetchingNextDocumentPage, fetchNextDocumentPage]);

  if (documentLoading) {
    return <DocumentChatLoading />;
  }

  if (documentError) {
    return (
      <div className="border border-red-500/20 rounded-lg px-8 py-12 text-center">
        <div className="text-[48px] text-red-400/30 mb-4">
          <FolderOpen />
        </div>
        <h3 className="text-[18px] font-serif text-text/70 mb-2">
          Failed to load conversations
        </h3>
        <p className="text-[13px] text-text/40 font-sans mb-6">
          There was an error loading your chat history. Please try again.
        </p>
        <button
          onClick={() => refetchDocumentChats()}
          className="px-6 py-2.5 bg-primary text-background text-[12px] font-bold tracking-wider font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  if (allDocumentChats.length === 0 && !searchQuery) {
    return <EmptyDocumentChats />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-serif text-text/90 mb-1">
              Your Conversations
            </h2>
            <p className="text-[13px] text-text/40 font-sans">
              Continue chatting with your documents
            </p>
          </div>
          <div className="text-[11px] text-text/25 font-sans tracking-wider">
            {allDocumentChats.length} conversation
            {allDocumentChats.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Search bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search Chats by document title..."
        />
      </div>

      {/* No search results */}
      {allDocumentChats.length === 0 && searchQuery && (
        <p className="text-center text-[13px] text-text/40 font-sans py-12">
          No conversations match &quot;{searchQuery}&quot;
        </p>
      )}

      {/* Chat Grid */}
      {allDocumentChats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDocumentChats.map((docChat) => (
            <ChatCard key={docChat._id} documentChat={docChat} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasNextDocumentPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextDocumentPage ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-sans text-primary tracking-wider">
                Loading more conversations
              </span>
              <ThreeDot color="#c9a227" size="small" />
            </div>
          ) : (
            <button
              onClick={() => fetchNextDocumentPage()}
              className="px-6 py-2.5 border border-white/10 text-text/50 rounded-sm text-[11px] tracking-widest font-sans transition-all duration-200 hover:border-primary/30 hover:text-text/70"
            >
              LOAD MORE
            </button>
          )}
        </div>
      )}

      {!hasNextDocumentPage && allDocumentChats.length > 0 && (
        <div className="text-center py-6 text-[11px] text-text/20 font-sans tracking-wider">
          — END OF CONVERSATIONS —
        </div>
      )}
    </div>
  );
}

export default ChatsTab;
