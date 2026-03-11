"use client";

import { forwardRef } from "react";
import VoiceInput from "./VoiceInput";
import SendIcon from "./icons/SendIcon";

const ChatInput = forwardRef(function ChatInput(
  { value, onChange, onSend, onVoiceTranscript, isLoading },
  ref,
) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    if (el.value === "") {
      el.rows = 1;
    } else {
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };
  const canSend = value.trim() && !isLoading;

  return (
    <div className="sticky bottom-10 z-30 flex w-full justify-center">
      <div className="flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 shadow-lg ring-1 ring-white/10 transition-all focus-within:ring-2 focus-within:ring-accent/50">
        <VoiceInput onTranscript={onVoiceTranscript} disabled={isLoading} />
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Спросите что угодно..."
          disabled={isLoading}
          rows={1}
          onInput={handleInput}
          className="flex-1 bg-transparent px-2 py-4 max-w-xl text-sm text-white placeholder-blue-300/50 outline-none disabled:opacity-50 sm:text-base resize-none"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
            canSend
              ? "bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-hover cursor-pointer active:scale-95"
              : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});

export default ChatInput;
