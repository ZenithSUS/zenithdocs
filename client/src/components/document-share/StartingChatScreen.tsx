import { Sparkles } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { MessageFormValues } from "./hooks/useMessageStream";

interface StartingChatScreenProps {
  setValue: UseFormSetValue<MessageFormValues>;
  documentTitle: string;
}

function StartingChatScreen({
  setValue,
  documentTitle,
}: StartingChatScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-[18px] font-serif text-text/80 mb-2">
        Start Asking Questions
      </h3>
      <p className="text-[12px] text-text/40 font-sans max-w-xs leading-relaxed mb-6">
        Ask anything about{" "}
        <span className="text-text/60 font-medium">{documentTitle}</span>
      </p>

      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {[
          "Summarize the main points",
          "What are the key takeaways?",
          "Explain the details",
        ].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => setValue("message", suggestion)}
            className="group p-3 bg-white/5 border border-white/10 rounded-lg text-left hover:border-primary/30 hover:bg-white/8 transition-all duration-200"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary/50 mt-0.5 shrink-0" />
              <span className="text-[12px] text-text/60 font-sans group-hover:text-text/80 transition-colors">
                {suggestion}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StartingChatScreen;
