import {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegister,
} from "react-hook-form";
import { MessageFormValues } from "./hooks/useMessageStream";
import { Send } from "lucide-react";
import { memo } from "react";

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
    <div className="shrink-0 border-t border-white/8 px-4 py-3 bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <textarea
          {...register("message")}
          ref={(e) => {
            register("message").ref(e);
            textareaRef.current = e;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this document..."
          disabled={isTyping}
          rows={1}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-12 text-[13px] text-text/90 font-sans placeholder:text-text/30 outline-none focus:border-primary/30 focus:bg-white/8 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: "44px", maxHeight: "120px" }}
        />

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!messageValue.trim() || isTyping}
          className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center hover:bg-[#e0b530] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {isTyping ? (
            <div className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <p className="text-[9px] text-text/25 font-sans text-center mt-2 tracking-wider">
        AI responses may contain errors. Verify important information.
      </p>
    </div>
  );
}

export default memo(MessageInputArea);
