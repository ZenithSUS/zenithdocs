import { MoreHorizontal } from "lucide-react";
import { RefObject, SetStateAction } from "react";
import Doc from "@/types/doc";

interface Props {
  document: Doc;
  actionsButtonRefs: RefObject<Map<string, HTMLButtonElement>>;
  setActionsMenuOpen: (value: SetStateAction<string | null>) => void;
  isNavigating: boolean;
  isActionsOpen: boolean;
}

const ActionButton = ({
  document: doc,
  actionsButtonRefs,
  setActionsMenuOpen,
  isNavigating,
  isActionsOpen,
}: Props) => (
  <div className="sm:col-start-6 flex justify-end relative overflow-hidden">
    <button
      ref={(el) => {
        if (el) {
          actionsButtonRefs.current?.set(doc._id, el);
        } else {
          actionsButtonRefs.current?.delete(doc._id);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActionsMenuOpen(isActionsOpen ? null : doc._id);
      }}
      className="p-2 text-text/30 hover:text-text/70 transition-colors disabled:opacity-50"
      disabled={isNavigating}
    >
      <MoreHorizontal />
    </button>
  </div>
);

export default ActionButton;
