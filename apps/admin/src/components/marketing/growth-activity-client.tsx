"use client";

import { useState, useEffect } from "react";
import { ExternalLink, RefreshCw, TrendingUp } from "lucide-react";
import type { GrowthActivityEntry } from "@/app/api/skylar/growth-activity/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(text: string, max = 120): string {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── Platform icon (inline SVG, no external deps) ─────────────────────────────

function RedditIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<GrowthActivityEntry["type"], string> = {
  reddit: "Reddit",
  x_community: "X Community",
  tweet: "Tweet",
  reply: "Reply",
  thread: "Thread",
};

const TYPE_COLORS: Record<GrowthActivityEntry["type"], { bg: string; text: string }> = {
  reddit: { bg: "rgba(255,87,0,0.15)", text: "#ff5700" },
  x_community: { bg: "rgba(10,132,255,0.15)", text: "#5ac8fa" },
  tweet: { bg: "rgba(10,132,255,0.12)", text: "#0a84ff" },
  reply: { bg: "rgba(48,209,88,0.12)", text: "#30d158" },
  thread: { bg: "rgba(255,159,10,0.12)", text: "#ff9f0a" },
};

const STATUS_COLORS: Record<GrowthActivityEntry["status"], { bg: string; text: string }> = {
  posted: { bg: "rgba(48,209,88,0.12)", text: "#30d158" },
  pending: { bg: "rgba(255,159,10,0.12)", text: "#ff9f0a" },
  failed: { bg: "rgba(255,69,58,0.12)", text: "#ff453a" },
};

// ── Activity Card ─────────────────────────────────────────────────────────────

function ActivityCard({ entry }: { entry: GrowthActivityEntry }) {
  const typeMeta = TYPE_COLORS[entry.type];
  const statusMeta = STATUS_COLORS[entry.status];
  const typeLabel = TYPE_LABELS[entry.type];

  const context =
    entry.subreddit
      ? `r/${entry.subreddit}`
      : entry.community
        ? entry.community
        : null;

  const engagementItems =
    entry.platform === "reddit"
      ? [
          { label: "↑", value: entry.engagement.upvotes },
          { label: "💬", value: entry.engagement.comments },
        ]
      : [
          { label: "♥", value: entry.engagement.likes },
          { label: "↺", value: entry.engagement.retweets },
        ];

  const card = (
    <div
      className="mac-card p-4 flex flex-col gap-3 active:opacity-80 transition-opacity"
      style={{ background: "#2c2c2e", cursor: entry.url ? "pointer" : "default" }}
    >
      {/* Top row: badges + timestamp */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Platform icon */}
          <span
            className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0"
            style={{
              background: entry.platform === "reddit"
                ? "rgba(255,87,0,0.15)"
                : "rgba(255,255,255,0.08)",
              color: entry.platform === "reddit" ? "#ff5700" : "#f5f5f7",
            }}
          >
            {entry.platform === "reddit" ? (
              <RedditIcon size={13} />
            ) : (
              <XIcon size={12} />
            )}
          </span>
          {/* Type badge */}
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: typeMeta.bg, color: typeMeta.text }}
          >
            {typeLabel}
          </span>
          {/* Context (subreddit / community) */}
          {context && (
            <span className="text-[11px]" style={{ color: "#636366" }}>
              {context}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full capitalize"
            style={{ background: statusMeta.bg, color: statusMeta.text }}
          >
            {entry.status}
          </span>
          {/* Timestamp */}
          <span className="text-[11px]" style={{ color: "#48484a" }}>
            {relativeTime(entry.postedAt)}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-[13px] leading-relaxed" style={{ color: "#e5e5ea" }}>
        {truncate(entry.content)}
      </p>

      {/* Bottom row: engagement + link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {engagementItems.map(({ label, value }) => (
            <span key={label} className="text-[12px]" style={{ color: "#636366" }}>
              {label} {value}
            </span>
          ))}
        </div>
        {entry.url && (
          <span className="flex items-center gap-1 text-[12px]" style={{ color: "#0a84ff" }}>
            View post <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (entry.url) {
    return (
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block no-underline">
        {card}
      </a>
    );
  }
  return card;
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 rounded-xl gap-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <TrendingUp className="w-8 h-8 opacity-20" />
      <div className="text-center">
        <p className="text-[15px] font-semibold mb-1" style={{ color: "#f5f5f7" }}>
          No growth activity yet
        </p>
        <p className="text-[13px]" style={{ color: "#636366" }}>
          Skylar will log Reddit posts, X community posts,<br />
          replies, and tweets here automatically.
        </p>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="mac-card p-4 space-y-3 animate-pulse"
      style={{ background: "#2c2c2e" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-4 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="h-3 w-16 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-4/5 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="h-3 w-1/3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
}

// ── Filter types ──────────────────────────────────────────────────────────────

type FilterType = "all" | GrowthActivityEntry["type"];

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Reddit", value: "reddit" },
  { label: "X Community", value: "x_community" },
  { label: "Tweets", value: "tweet" },
  { label: "Replies", value: "reply" },
  { label: "Threads", value: "thread" },
];

// ── Main Component ────────────────────────────────────────────────────────────

export function GrowthActivityClient() {
  const [entries, setEntries] = useState<GrowthActivityEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await fetch("/api/skylar/growth-activity");
      const data = (await res.json()) as { entries: GrowthActivityEntry[]; total: number };
      setEntries(data.entries);
      setTotal(data.total);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  // Count by type for filter badges
  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[22px] font-semibold"
            style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}
          >
            Growth Activity
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
            Reddit · X Community · Replies · Tweets
            {total > 0 && (
              <span className="ml-2 font-medium" style={{ color: "#8e8e93" }}>
                · {total} total
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => void fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all min-h-[44px] min-w-[44px] justify-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#8e8e93",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Filter pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map(({ label, value }) => {
          const isActive = filter === value;
          const count = value === "all" ? total : (counts[value] ?? 0);
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap flex-shrink-0 transition-all"
              style={
                isActive
                  ? { background: "rgba(10,132,255,0.2)", color: "#5ac8fa", border: "1px solid rgba(10,132,255,0.3)" }
                  : { background: "rgba(255,255,255,0.06)", color: "#8e8e93", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {label}
              {count > 0 && (
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(10,132,255,0.2)" : "rgba(255,255,255,0.08)",
                    color: isActive ? "#5ac8fa" : "#636366",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Activity feed */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <ActivityCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
