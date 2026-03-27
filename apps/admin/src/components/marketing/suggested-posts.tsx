"use client";

import { useState, useEffect, useCallback } from "react";
import type { PostSuggestion } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
  MessageSquare,
  Quote,
  AlignLeft,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  high: { bg: "rgba(255,69,58,0.15)", text: "#ff453a" },
  medium: { bg: "rgba(255,159,10,0.15)", text: "#ff9f0a" },
  low: { bg: "rgba(48,209,88,0.15)", text: "#30d158" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "rgba(255,255,255,0.06)", text: "#8e8e93", label: "Pending" },
  approved: { bg: "rgba(10,132,255,0.15)", text: "#0a84ff", label: "Approved" },
  posted: { bg: "rgba(48,209,88,0.15)", text: "#30d158", label: "Posted" },
  rejected: { bg: "rgba(255,69,58,0.1)", text: "#636366", label: "Rejected" },
};

const TYPE_ICONS: Record<string, typeof MessageSquare> = {
  thread: AlignLeft,
  single: MessageSquare,
  "quote-tweet": Quote,
};

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

function SuggestionCard({
  suggestion,
  onStatusChange,
}: {
  suggestion: PostSuggestion;
  onStatusChange: (id: string, status: "approved" | "rejected" | "posted") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  const status = suggestion.status ?? "pending";
  const statusStyle = STATUS_COLORS[status] ?? STATUS_COLORS.pending!;
  const priorityStyle = PRIORITY_COLORS[suggestion.priority] ?? PRIORITY_COLORS.medium!;
  const TypeIcon = TYPE_ICONS[suggestion.type] ?? MessageSquare;

  const isAllenDraft = !suggestion.account || suggestion.account === "blueprint_os";
  const hasThread = suggestion.type === "thread" && suggestion.thread && suggestion.thread.length > 0;

  const fullText = hasThread
    ? [suggestion.hook, ...suggestion.thread!].join("\n\n---\n\n")
    : suggestion.hook;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus: "approved" | "rejected" | "posted") => {
    setUpdating(true);
    onStatusChange(suggestion.id, newStatus);
    setUpdating(false);
  };

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150"
      style={{
        background: "#2c2c2e",
        border: `1px solid ${status === "approved" ? "rgba(10,132,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        opacity: status === "rejected" ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#8e8e93" }} />
            <Badge
              label={suggestion.type}
              bg="rgba(255,255,255,0.06)"
              color="#c7c7cc"
            />
            <Badge
              label={suggestion.priority}
              bg={priorityStyle.bg}
              color={priorityStyle.text}
            />
            <Badge
              label={statusStyle.label}
              bg={statusStyle.bg}
              color={statusStyle.text}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isAllenDraft ? (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{ background: "rgba(10,132,255,0.1)", color: "#5ac8fa" }}
              >
                <User className="w-3 h-3" />
                Draft for Allen
              </div>
            ) : (
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
                style={{ background: "rgba(191,90,242,0.1)", color: "#bf5af2" }}
              >
                <Bot className="w-3 h-3" />
                Auto-post by Skylar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hook text */}
      <div className="px-4 py-2">
        <p
          className="text-[13px] leading-relaxed whitespace-pre-wrap"
          style={{ color: "#e5e5ea" }}
        >
          {suggestion.hook}
        </p>
      </div>

      {/* Thread expansion */}
      {hasThread && (
        <div className="px-4 pb-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[12px] font-medium transition-colors"
            style={{ color: "#0a84ff" }}
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            {suggestion.thread!.length} more tweet{suggestion.thread!.length > 1 ? "s" : ""} in thread
          </button>
          {expanded && (
            <div className="mt-2 space-y-2 pl-3" style={{ borderLeft: "2px solid rgba(10,132,255,0.3)" }}>
              {suggestion.thread!.map((tweet, i) => (
                <div key={i} className="py-1.5">
                  <p
                    className="text-[12px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: "#c7c7cc" }}
                  >
                    {tweet}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meta: timing + tags */}
      <div className="px-4 py-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-[11px]" style={{ color: "#636366" }}>
          <Clock className="w-3 h-3" />
          {suggestion.timing}
        </div>
        {suggestion.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="w-3 h-3" style={{ color: "#636366" }} />
            {suggestion.tags.map((tag) => (
              <span key={tag} className="text-[11px]" style={{ color: "#8e8e93" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {status !== "approved" && status !== "posted" && (
          <button
            onClick={() => handleStatusChange("approved")}
            disabled={updating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              background: "rgba(10,132,255,0.15)",
              color: "#0a84ff",
              border: "1px solid rgba(10,132,255,0.25)",
            }}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            Approve
          </button>
        )}
        {status === "approved" && (
          <button
            onClick={() => handleStatusChange("posted")}
            disabled={updating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              background: "rgba(48,209,88,0.15)",
              color: "#30d158",
              border: "1px solid rgba(48,209,88,0.25)",
            }}
          >
            <Check className="w-3.5 h-3.5" />
            Mark Posted
          </button>
        )}
        {status !== "rejected" && status !== "posted" && (
          <button
            onClick={() => handleStatusChange("rejected")}
            disabled={updating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#636366",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            Reject
          </button>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ml-auto"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: copied ? "#30d158" : "#8e8e93",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export function SuggestedPosts() {
  const [suggestions, setSuggestions] = useState<PostSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch("/api/skylar/suggestions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = (await res.json()) as PostSuggestion[];
      setSuggestions(data);
      setError(null);
    } catch {
      setError("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSuggestions();
    // Auto-refresh every 60s
    const interval = setInterval(() => void fetchSuggestions(), 60_000);
    return () => clearInterval(interval);
  }, [fetchSuggestions]);

  const handleStatusChange = async (id: string, status: "approved" | "rejected" | "posted") => {
    // Optimistic update
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    );

    try {
      const res = await fetch("/api/skylar/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        // Revert on failure
        void fetchSuggestions();
      }
    } catch {
      void fetchSuggestions();
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl animate-pulse"
            style={{ background: "#2c2c2e" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: "#2c2c2e" }}
      >
        <p className="text-[13px]" style={{ color: "#ff453a" }}>
          {error}
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "#2c2c2e" }}
      >
        <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: "#636366" }} />
        <p className="text-[15px] font-semibold mb-1" style={{ color: "#f5f5f7" }}>
          No suggestions yet
        </p>
        <p className="text-[13px]" style={{ color: "#8e8e93" }}>
          Skylar will generate post suggestions on the next cron run
        </p>
      </div>
    );
  }

  // Sort: pending first, then approved, then posted/rejected
  const sortOrder: Record<string, number> = { pending: 0, approved: 1, posted: 2, rejected: 3 };
  const sorted = [...suggestions].sort((a, b) => {
    const aOrder = sortOrder[a.status ?? "pending"] ?? 0;
    const bOrder = sortOrder[b.status ?? "pending"] ?? 0;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Within same status, high priority first
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
  });

  const pendingCount = suggestions.filter((s) => !s.status || s.status === "pending").length;
  const approvedCount = suggestions.filter((s) => s.status === "approved").length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: "#bf5af2" }} />
          <span className="text-[13px] font-medium" style={{ color: "#f5f5f7" }}>
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
          </span>
        </div>
        {pendingCount > 0 && (
          <span className="text-[12px]" style={{ color: "#ff9f0a" }}>
            {pendingCount} awaiting review
          </span>
        )}
        {approvedCount > 0 && (
          <span className="text-[12px]" style={{ color: "#0a84ff" }}>
            {approvedCount} approved
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
