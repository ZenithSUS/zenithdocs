import { Paperclip, Send } from "lucide-react";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import {
  GlobalMessageFormValues,
  StreamingBubble,
} from "../hooks/useGlobalMessageStream";
import React from "react";

interface InputAreaProps {
  register: UseFormRegister<GlobalMessageFormValues>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  messageValue: string;
  streamingBubble: StreamingBubble | null;
  onSubmit: (values: GlobalMessageFormValues) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<
    GlobalMessageFormValues,
    GlobalMessageFormValues
  >;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function InputArea({
  register,
  textareaRef,
  messageValue,
  streamingBubble,
  onSubmit,
  handleSubmit,
  handleKeyDown,
}: InputAreaProps) {
  return (
    <div className="shrink-0 px-3 pb-3 pt-2">
      <div
        className="h-px mb-2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        }}
      />
      <div
        className="flex items-end gap-2 rounded-xl px-3 py-2 transition-colors duration-150"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocusCapture={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "rgba(201,162,39,0.28)")
        }
        onBlurCapture={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor =
            "rgba(255,255,255,0.08)")
        }
      >
        <button
          className="shrink-0 mb-0.5 opacity-25 hover:opacity-50 transition-opacity duration-150"
          aria-label="Attach file"
        >
          <Paperclip size={15} color="white" />
        </button>

        <textarea
          {...register("message")}
          ref={(e) => {
            register("message").ref(e);
            (
              textareaRef as React.RefObject<HTMLTextAreaElement | null>
            ).current = e;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your documents…"
          rows={1}
          disabled={!!streamingBubble}
          className="gc-textarea flex-1 resize-none bg-transparent text-[12px] text-white/80
                placeholder:text-white/20 outline-none leading-relaxed
                disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            maxHeight: 100,
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        />

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!messageValue?.trim() || !!streamingBubble}
          className="send-btn shrink-0 mb-0.5 w-7 h-7 rounded-lg flex items-center justify-center
                transition-all duration-150 disabled:opacity-20 active:scale-90"
          style={{
            background:
              messageValue?.trim() && !streamingBubble
                ? "rgba(201,162,39,0.18)"
                : "transparent",
            border:
              messageValue?.trim() && !streamingBubble
                ? "1px solid rgba(201,162,39,0.28)"
                : "1px solid transparent",
          }}
          aria-label="Send message"
        >
          {streamingBubble ? (
            <div
              className="w-3 h-3 rounded-full border border-t-transparent animate-spin"
              style={{
                borderColor: "rgba(201,162,39,0.5)",
                borderTopColor: "transparent",
              }}
            />
          ) : (
            <Send
              size={13}
              className="send-icon"
              style={{ color: "#C9A227" }}
            />
          )}
        </button>
      </div>

      <p className="text-[10px] text-white/15 text-center mt-1.5 tracking-wide hidden sm:block">
        Enter ↵ to send · Shift+Enter for new line
      </p>
    </div>
  );
}

export default InputArea;
