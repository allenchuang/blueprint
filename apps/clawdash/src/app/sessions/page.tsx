"use client";

import { useState, useMemo } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { useSessionMessages } from "@/hooks/use-session-messages";
import { formatNumber, formatCost, timeAgo } from "@/lib/utils";
import { Search, X, MessageSquare, ChevronRight } from "lucide-react";

function MessageViewer({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  const { data, isLoading } = useSessionMessages(sessionId);
  const messages = data?.messages ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4 sm:mx-0">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[14px] font-semibold">Session Messages</h3>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              {sessionId.slice(0, 24)}…
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-[13px] text-muted-foreground">
              Loading messages…
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-[13px] text-muted-foreground flex flex-col items-center gap-2">
              <MessageSquare className="w-8 h-8 opacity-30" />
              No messages found for this session.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words line-clamp-10">
                    {msg.content}
                  </p>
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
        </div>

        <div className="px-4 py-2.5 border-t border-border shrink-0">
          <p className="text-[11px] text-muted-foreground">
            Showing last {messages.length} messages
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const { data } = useSessions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  const sessions = data?.sessions || [];

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.model.toLowerCase().includes(q) ||
          s.channel?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessions, search, statusFilter]);

  const statuses = ["all", "active", "idle", "closed"];

  return (
    <div className="p-6 space-y-5 max-w-6xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          All agent sessions and their activity — click a row to view messages
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-full bg-input text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 text-[12px] rounded-md capitalize transition-colors ${
                statusFilter === s
                  ? "bg-background text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_100px_100px_80px_100px_32px] gap-2 px-4 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          <span>Session</span>
          <span>Model</span>
          <span className="text-right">Tokens In</span>
          <span className="text-right">Tokens Out</span>
          <span className="text-right">Messages</span>
          <span className="text-right">Cost</span>
          <span className="text-right">Updated</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-muted-foreground">
            {sessions.length === 0
              ? "No sessions found. Is OpenClaw running?"
              : "No sessions match your filters."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                className="grid grid-cols-[1fr_1fr_100px_100px_100px_80px_100px_32px] gap-2 px-4 py-2.5 items-center hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      s.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : s.status === "idle"
                          ? "bg-yellow-500"
                          : "bg-muted-foreground/30"
                    }`}
                  />
                  <span className="text-[13px] font-mono truncate">
                    {s.id.slice(0, 16)}
                  </span>
                </div>
                <span className="text-[12px] text-muted-foreground truncate">
                  {s.model}
                </span>
                <span className="text-[13px] text-right font-mono">
                  {formatNumber(s.tokensIn)}
                </span>
                <span className="text-[13px] text-right font-mono">
                  {formatNumber(s.tokensOut)}
                </span>
                <span className="text-[13px] text-right font-mono">
                  {s.messageCount}
                </span>
                <span className="text-[13px] text-right font-mono">
                  {formatCost(s.costCents)}
                </span>
                <span className="text-[12px] text-right text-muted-foreground">
                  {timeAgo(s.updatedAt)}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSessionId && (
        <MessageViewer
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
}
