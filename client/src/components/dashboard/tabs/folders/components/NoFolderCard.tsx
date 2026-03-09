import NewFolderModal from "../../../modals/folder/NewFolderModal";

interface NoFolderCardProps {
  userId: string;
  onRefresh: (scope: "all" | "overview" | "user") => void;
}

function NoFolderCard({ userId, onRefresh }: NoFolderCardProps) {
  return (
    <div className="space-y-5">
      <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
        <div className="text-[48px] text-text/10 mb-4">⬡</div>
        <h3 className="text-[18px] font-serif text-text/60 mb-2">
          No folders yet
        </h3>
        <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto mb-6">
          Create folders to organize your documents by project, client, or
          topic.
        </p>
        <NewFolderModal
          userId={userId}
          text="CREATE FOLDER"
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}

export default NoFolderCard;
