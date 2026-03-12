import { MessageSquare } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { GlobalMessageFormValues } from "../hooks/useGlobalMessageStream";

interface EmptyStateGlobalMessageProps {
  setValue: UseFormSetValue<GlobalMessageFormValues>;
}

const SUGGESTION_PROMPTS = [
  { icon: "✦", label: "What is ZenithDocs?" },
  { icon: "⇄", label: "Compare documents I own" },
  { icon: "◎", label: "Summarize a document" },
  { icon: "⊹", label: "Find key insights" },
];

function EmptyStateGlobalMessage({ setValue }: EmptyStateGlobalMessageProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-4">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(201,162,39,0.08)",
          border: "1px solid rgba(201,162,39,0.15)",
        }}
      >
        <MessageSquare size={20} style={{ color: "#C9A227", opacity: 0.7 }} />
      </div>
      <div className="text-center px-4">
        <p className="text-white/40 text-[12px] tracking-wide mb-1">
          Start a conversation
        </p>
        <p className="text-white/20 text-[11px]">
          Ask anything about your documents
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full px-2">
        {SUGGESTION_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setValue("message", prompt.label)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-150 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(201,162,39,0.08)";
              el.style.borderColor = "rgba(201,162,39,0.2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.03)";
              el.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            <span className="text-[13px] opacity-50 shrink-0">
              {prompt.icon}
            </span>
            <span className="text-[11px] text-white/35 leading-tight">
              {prompt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyStateGlobalMessage;
