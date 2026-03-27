"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";

const MAX_CHARS = 4000;

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = "Message the agent…",
  disabled = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSend = value.trim().length > 0 && !isLoading && !disabled && !isOverLimit;

  function handleSend() {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card/80 backdrop-blur-sm",
        "focus-within:border-border/80 focus-within:ring-2 focus-within:ring-ring/20",
        "transition-all duration-150",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent px-4 pt-3 pb-10 text-[13px] leading-relaxed",
          "text-foreground placeholder:text-muted-foreground/50",
          "focus:outline-none",
          "max-h-[200px] overflow-y-auto"
        )}
      />

      {/* Bottom bar: char count + send */}
      <div className="absolute bottom-2.5 left-4 right-2.5 flex items-center justify-between pointer-events-none">
        {/* Character count */}
        <span
          className={cn(
            "text-[10px] font-mono transition-colors",
            charCount === 0
              ? "text-transparent"
              : isOverLimit
                ? "text-destructive"
                : charCount > MAX_CHARS * 0.8
                  ? "text-warning"
                  : "text-muted-foreground/50"
          )}
        >
          {charCount}/{MAX_CHARS}
        </span>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "pointer-events-auto flex items-center justify-center",
            "w-7 h-7 rounded-lg transition-all duration-150",
            canSend
              ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
              : "bg-muted text-muted-foreground/40 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
