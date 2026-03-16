"use client";

import { useState, useMemo } from "react";
import { useSessions } from "@/hooks/use-sessions";
import { formatNumber, formatCost, timeAgo } from "@/lib/utils";
import { Search, Filter } from "lucide-react";

export default function SessionsPage() {
  const { data } = useSessions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
          All agent sessions and their activity
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions..."
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
        <div className="grid grid-cols-[1fr_1fr_100px_100px_100px_80px_100px] gap-2 px-4 py-2.5 border-b border-border text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          <span>Session</span>
          <span>Model</span>
          <span className="text-right">Tokens In</span>
          <span className="text-right">Tokens Out</span>
          <span className="text-right">Messages</span>
          <span className="text-right">Cost</span>
          <span className="text-right">Updated</span>
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
                className="grid grid-cols-[1fr_1fr_100px_100px_100px_80px_100px] gap-2 px-4 py-2.5 items-center hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      s.status === "active"
                        ? "bg-success"
                        : s.status === "idle"
                          ? "bg-warning"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
