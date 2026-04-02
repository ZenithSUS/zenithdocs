import DocumentCard from "@/components/dashboard/cards/DocumentCard";
import DocumentCardSkeleton from "@/components/dashboard/skeleton/DocumentCardSkeleton";
import { DashboardOverview } from "@/types/dashboard";

interface Props {
  recentDocuments: DashboardOverview["recentDocuments"] | undefined;
  overviewLoading: boolean;
  onViewAll: () => void;
}

const RecentDocuments = ({
  recentDocuments,
  overviewLoading,
  onViewAll,
}: Props) => (
  <div className="xl:col-span-3 border border-white/8 rounded-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
      <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
        RECENT DOCUMENTS
      </span>
      <button
        onClick={onViewAll}
        className="text-[11px] text-primary/70 font-sans hover:text-primary transition-colors"
      >
        View all →
      </button>
    </div>

    <div className="divide-y divide-white/4">
      {overviewLoading ? (
        <DocumentCardSkeleton />
      ) : recentDocuments?.length === 0 ? (
        <div className="px-5 py-5 text-center text-text/40">
          No recent documents
        </div>
      ) : (
        recentDocuments?.map((doc) => (
          <DocumentCard key={doc._id} document={doc} />
        ))
      )}
    </div>
  </div>
);

export default RecentDocuments;
