import { DocStatus } from "@/types/doc";

const STATUS_META: Record<
  DocStatus,
  { label: string; dot: string; text: string }
> = {
  uploaded: { label: "Uploaded", dot: "bg-blue-400", text: "text-blue-300" },
  processing: {
    label: "Processing",
    dot: "bg-yellow-400",
    text: "text-yellow-300",
  },
  completed: {
    label: "Completed",
    dot: "bg-green-400",
    text: "text-green-300",
  },
  failed: { label: "Failed", dot: "bg-red-400", text: "text-red-300" },
};

export default STATUS_META;
