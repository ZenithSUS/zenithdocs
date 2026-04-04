import { LearningSet } from "@/types/learning-set";
import { memo, useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import DeleteLearningSetModal from "@/components/dashboard/modals/study/DeleteLearningSetModal";
import RenameLearningSetModal from "@/components/dashboard/modals/study/RenameLearningSetModal";

interface DropdownMenuProps {
  userId: string;
  page: number;
  learningSet: LearningSet;
}

function LearningSetDropdownMenu({
  userId,
  page,
  learningSet,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"rename" | "delete" | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click / scroll
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <div
        ref={menuRef}
        className="relative"
        data-stop-propagation
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="More options"
          onClick={() => setOpen((v) => !v)}
          className={`
            flex items-center justify-center
            w-7 h-7 rounded-lg
            text-white/40 hover:text-white/80
            hover:bg-white/10 active:bg-white/15
            transition-all duration-150
            ${open ? "bg-white/10 text-white/80" : ""}
          `}
        >
          <MoreVertical size={15} />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div
            className="
              absolute right-0 top-[calc(100%+6px)] z-50
              min-w-38 rounded-xl
              bg-background border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              p-1
              animate-in fade-in zoom-in-95 duration-150 origin-top-right
            "
          >
            {/* Rename */}
            <button
              className="
                flex items-center gap-2.5 w-full
                px-3 py-2 rounded-lg
                text-[13px] font-medium text-white/70
                hover:bg-white/8 hover:text-white
                active:bg-white/10
                transition-colors duration-100
              "
              onClick={() => {
                setOpen(false);
                setActiveModal("rename");
              }}
            >
              <Pencil size={13} className="shrink-0 opacity-70" />
              Rename
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-white/7" />

            {/* Delete */}
            <button
              className="
                flex items-center gap-2.5 w-full
                px-3 py-2 rounded-lg
                text-[13px] font-medium text-red-400/80
                hover:bg-red-500/10 hover:text-red-400
                active:bg-red-500/15
                transition-colors duration-100
              "
              onClick={() => {
                setOpen(false);
                setActiveModal("delete");
              }}
            >
              <Trash2 size={13} className="shrink-0" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModal === "rename" && (
        <div data-stop-propagation onClick={(e) => e.stopPropagation()}>
          <RenameLearningSetModal
            userId={userId}
            page={page}
            learningSetId={learningSet._id}
            learningSetName={learningSet.title ?? "Untitled"}
            // auto-open on mount; close callback resets state
            defaultOpen
            onClose={() => setActiveModal(null)}
          />
        </div>
      )}

      {activeModal === "delete" && (
        <div data-stop-propagation onClick={(e) => e.stopPropagation()}>
          <DeleteLearningSetModal
            learningSetId={learningSet._id}
            userId={userId}
            page={page}
            defaultOpen
            onClose={() => setActiveModal(null)}
          />
        </div>
      )}
    </>
  );
}

export default memo(LearningSetDropdownMenu);
