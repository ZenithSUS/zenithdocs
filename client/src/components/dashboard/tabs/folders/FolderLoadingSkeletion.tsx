import FolderCardSkeleton from "@/components/dashboard/skeleton/FolderCardSkeleton";

function FolderLoadingSkeletion() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <FolderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default FolderLoadingSkeletion;
