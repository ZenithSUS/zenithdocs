import { Send } from "lucide-react";
import {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form";
import { MessageFormValues } from "../hooks/useMessageStream";

interface MessageInputAreaProps {
  register: UseFormRegister<MessageFormValues>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isTyping: boolean;
  messageValue: string;
  onSubmit: (values: MessageFormValues) => Promise<void>;
  handleSubmit: (
    onValid: SubmitHandler<MessageFormValues>,
    onInvalid?: SubmitErrorHandler<MessageFormValues> | undefined,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

function MessageInputArea({
  register,
  textareaRef,
  handleKeyDown,
  isTyping,
  onSubmit,
  messageValue,
  handleSubmit,
}: MessageInputAreaProps) {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-4">
        <div className="relative">
          <textarea
            {...register("message")}
            ref={(e) => {
              register("message").ref(e);
              (
                textareaRef as React.RefObject<HTMLTextAreaElement | null>
              ).current = e;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            disabled={isTyping}
            rows={1}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-[14px] text-text/90 font-sans placeholder:text-text/30 outline-none focus:border-primary/30 focus:bg-white/8 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: "56px", maxHeight: "200px" }}
          />
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={!messageValue.trim() || isTyping}
            className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center hover:bg-[#e0b530] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-text/25 font-sans text-center mt-3 tracking-wider">
          AI responses may contain errors. Verify important information.
        </p>
      </div>
    </footer>
  );
}

export default MessageInputArea;
