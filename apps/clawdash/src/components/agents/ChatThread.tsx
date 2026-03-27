"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";

interface ChatThreadProps {
  messages: ChatMessageData[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 px-4">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm shrink-0 mt-0.5">
        🤖
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-3 h-9">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function ChatThread({
  messages,
  isLoading = false,
  emptyState,
  className,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    const bottom = bottomRef.current;
    if (!bottom) return;
    bottom.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-4 overflow-y-auto py-4",
        "scrollbar-thin",
        className
      )}
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          {emptyState ?? (
            <div className="text-center space-y-2">
              <p className="text-[28px]">💬</p>
              <p className="text-[13px] text-muted-foreground">
                No messages yet. Start a conversation.
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isGrouped =
              prevMessage?.role === message.role &&
              prevMessage?.agentId === message.agentId;

            return (
              <div
                key={message.id}
                className={cn(isGrouped && "-mt-2")}
              >
                <ChatMessage message={message} />
              </div>
            );
          })}

          {isLoading && <TypingIndicator />}
        </>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-0 shrink-0" />
    </div>
  );
}
