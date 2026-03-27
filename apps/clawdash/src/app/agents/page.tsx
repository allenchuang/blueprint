"use client";

import { useState, useRef, useEffect } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { useAgentStatuses, useSendMessage } from "@/hooks/use-agents";
import type { AgentStatus } from "@/hooks/use-agents";
import { timeAgo } from "@/lib/utils";
import { Send, MessageSquare, ChevronRight } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function AgentCard({
  agent,
  isSelected,
  onSelect,
}: {
  agent: AgentStatus;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusColor =
    agent.status === "active"
      ? "bg-green-500"
      : agent.status === "idle"
        ? "bg-yellow-500"
        : "bg-muted-foreground/30";

  const statusLabel =
    agent.status === "active"
      ? "Active"
      : agent.status === "idle"
        ? "Idle"
        : "Offline";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
        isSelected
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
      }`}
    >
      <span className="text-xl shrink-0">{agent.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium">{agent.name}</span>
          <div
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor} ${
              agent.status === "active" ? "animate-pulse" : ""
            }`}
          />
        </div>
        <p className="text-[11px] text-current opacity-60 truncate">
          {statusLabel}
          {agent.lastSeen ? ` · ${timeAgo(agent.lastSeen)}` : ""}
        </p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
    </button>
  );
}

function ChatPanel({ agent }: { agent: AgentStatus }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || isPending) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    sendMessage(
      {
        message: text,
        agentId: agent.id,
        sessionKey: agent.sessionKey,
      },
      {
        onSuccess: (data) => {
          const responseText =
            typeof data.response === "string"
              ? data.response
              : data.error
                ? `Error: ${data.error}`
                : JSON.stringify(data, null, 2);

          const assistantMsg: ChatMessage = {
            id: String(Date.now() + 1),
            role: "assistant",
            content: responseText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        },
        onError: (err) => {
          const errorMsg: ChatMessage = {
            id: String(Date.now() + 1),
            role: "assistant",
            content: `Failed to send message: ${err.message}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        },
      }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 shrink-0">
        <span className="text-2xl">{agent.emoji}</span>
        <div>
          <h2 className="text-[14px] font-semibold">{agent.name}</h2>
          <p className="text-[12px] text-muted-foreground">
            {agent.model ?? "No active session"}
            {agent.messageCount !== undefined
              ? ` · ${agent.messageCount} messages`
              : ""}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              agent.status === "active"
                ? "bg-green-500 animate-pulse"
                : agent.status === "idle"
                  ? "bg-yellow-500"
                  : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-[12px] text-muted-foreground capitalize">
            {agent.status}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            <div>
              <p className="text-[14px] font-medium text-muted-foreground">
                No messages yet
              </p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Send a message to {agent.name} to start a conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    msg.role === "user"
                      ? "text-primary-foreground/60 text-right"
                      : "text-muted-foreground"
                  }`}
                >
                  {timeAgo(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        {isPending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl px-3.5 py-2.5">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name}…`}
            rows={1}
            className="flex-1 bg-input rounded-xl px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none min-h-[40px] max-h-[120px]"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 px-1">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  const { data: sessionsData } = useSessions();
  const sessions = sessionsData?.sessions ?? [];
  const agents = useAgentStatuses(sessions);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  return (
    <div className="h-full flex">
      {/* Agent list sidebar */}
      <div className="w-56 shrink-0 border-r border-border flex flex-col">
        <div className="px-4 py-3.5 border-b border-border">
          <h1 className="text-[14px] font-semibold tracking-tight">Agents</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Chat with active agents
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              onSelect={() => setSelectedAgentId(agent.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0">
        {selectedAgent ? (
          <ChatPanel agent={selectedAgent} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 p-8">
            <div className="flex gap-1">
              {agents.slice(0, 3).map((a) => (
                <span key={a.id} className="text-3xl">
                  {a.emoji}
                </span>
              ))}
            </div>
            <div>
              <p className="text-[15px] font-semibold">Select an agent</p>
              <p className="text-[13px] text-muted-foreground mt-1">
                Choose an agent from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
