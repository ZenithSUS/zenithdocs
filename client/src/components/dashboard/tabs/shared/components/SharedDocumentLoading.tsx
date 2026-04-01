import SharedDocumentSkeletonCard from "@/components/dashboard/skeleton/SharedDocumentSkeletonCard";

function SharedDocumentLoading() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <SharedDocumentSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default SharedDocumentLoading;
