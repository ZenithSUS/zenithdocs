import { Sparkles } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { MessageFormValues } from "../hooks/useMessageStream";

interface EmptyStateMessageProps {
  setValue: UseFormSetValue<MessageFormValues>;
  title: string;
}

function EmptyStateMessage({ setValue, title }: EmptyStateMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-[24px] font-serif text-text/80 mb-3">
        Start a Conversation
      </h2>
      <p className="text-[14px] text-text/40 font-sans max-w-md leading-relaxed mb-8">
        Ask questions about{" "}
        <span className="text-text/60 font-medium">{title}</span>. I'll help you
        understand and extract insights from the document.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {[
          "Summarize the main points",
          "What are the key takeaways?",
          "Explain the technical details",
          "What problems does this address?",
          "What is the overall impact?",
          "What are the challenges?",
        ].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => setValue("message", suggestion)}
            className="group p-4 bg-white/5 border border-white/10 rounded-lg text-left hover:border-primary/30 hover:bg-white/8 transition-all duration-200"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
              <span className="text-[13px] text-text/60 font-sans group-hover:text-text/80 transition-colors">
                {suggestion}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyStateMessage;
