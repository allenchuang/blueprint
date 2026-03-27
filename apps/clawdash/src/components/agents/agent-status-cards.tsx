"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AgentStatus } from "@/hooks/use-agents";
import { useSendMessage } from "@/hooks/use-agents";
import { timeAgo } from "@/lib/utils";
import { Send, X, MessageSquare } from "lucide-react";

interface QuickSendModalProps {
  agent: AgentStatus;
  onClose: () => void;
}

function QuickSendModal({ agent, onClose }: QuickSendModalProps) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  function handleSend() {
    const text = message.trim();
    if (!text || isPending) return;

    sendMessage(
      {
        message: text,
        agentId: agent.id,
        sessionKey: agent.sessionKey,
      },
      {
        onSuccess: (data) => {
          setSent(true);
          if (typeof data.response === "string") {
            setResponse(data.response);
          } else if (data.error) {
            setResponse(`Error: ${String(data.error)}`);
          } else {
            setResponse("Message sent.");
          }
        },
        onError: (err) => {
          setSent(true);
          setResponse(`Failed: ${err.message}`);
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md flex flex-col gap-0 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{agent.emoji}</span>
            <div>
              <h3 className="text-[14px] font-semibold">
                Quick message to {agent.name}
              </h3>
              <p className="text-[11px] text-muted-foreground capitalize">
                {agent.status}
                {agent.lastSeen ? ` · ${timeAgo(agent.lastSeen)}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent && response ? (
          <div className="p-5 space-y-3">
            <p className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">
              Response
            </p>
            <div className="bg-muted rounded-xl p-3.5 text-[13px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {response}
            </div>
            <button
              onClick={onClose}
              className="w-full h-9 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message ${agent.name}…`}
              rows={3}
              autoFocus
              className="w-full bg-input rounded-xl px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 h-9 rounded-xl border border-border text-[13px] hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || isPending}
                className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  onQuickSend,
}: {
  agent: AgentStatus;
  onQuickSend: () => void;
}) {
  const router = useRouter();

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
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{agent.emoji}</span>
          <div>
            <p className="text-[14px] font-semibold">{agent.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${statusColor} ${
                  agent.status === "active" ? "animate-pulse" : ""
                }`}
              />
              <span className="text-[11px] text-muted-foreground">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-[12px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Last seen</span>
          <span className="text-foreground/80">
            {agent.lastSeen ? timeAgo(agent.lastSeen) : "Never"}
          </span>
        </div>
        {agent.model && (
          <div className="flex items-center justify-between">
            <span>Model</span>
            <span className="text-foreground/80 font-mono text-[11px] truncate max-w-[120px]">
              {agent.model.split("/").pop() ?? agent.model}
            </span>
          </div>
        )}
        {agent.messageCount !== undefined && (
          <div className="flex items-center justify-between">
            <span>Messages</span>
            <span className="text-foreground/80">{agent.messageCount}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={() => router.push(`/agents`)}
          className="flex-1 h-8 rounded-lg border border-border text-[12px] hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat
        </button>
        <button
          onClick={onQuickSend}
          className="flex-1 h-8 rounded-lg bg-primary/10 text-primary text-[12px] hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          Quick Send
        </button>
      </div>
    </div>
  );
}

export function AgentStatusCards({ agents }: { agents: AgentStatus[] }) {
  const [quickSendAgent, setQuickSendAgent] = useState<AgentStatus | null>(
    null
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold">Agent Status</span>
        <span className="text-[11px] text-muted-foreground">
          {agents.filter((a) => a.status === "active").length} active
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onQuickSend={() => setQuickSendAgent(agent)}
          />
        ))}
      </div>

      {quickSendAgent && (
        <QuickSendModal
          agent={quickSendAgent}
          onClose={() => setQuickSendAgent(null)}
        />
      )}
    </div>
  );
}
