"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, TrendingUp, Zap, Target, ArrowRight, Clock, ToggleLeft, ToggleRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawTrend {
  name: string;
  tweet_volume: number;
}

interface Trend extends RawTrend {
  rank: number;
  category: "Tech" | "AI" | "Dev" | "Startup" | "General";
  relevance: "high" | "medium" | "low";
}

// ─── Scoring & categorization ─────────────────────────────────────────────────

const DEV_KEYWORDS = [
  "react", "next", "typescript", "javascript", "python", "ai", "gpt",
  "build", "dev", "code", "startup", "saas", "open source", "indie",
  "ship", "launch", "product",
];

function scoreTrend(name: string): "high" | "medium" | "low" {
  const lower = name.toLowerCase();
  const matches = DEV_KEYWORDS.filter((k) => lower.includes(k)).length;
  if (matches >= 2) return "high";
  if (matches >= 1) return "medium";
  return "low";
}

const AI_KEYWORDS = ["ai", "gpt", "llm", "ml", "openai", "claude", "gemini", "neural", "aitools"];
const TECH_KEYWORDS = ["react", "next", "typescript", "javascript", "python", "webdev", "frontend", "backend", "api", "node", "css", "html"];
const DEV_KW = ["dev", "code", "build", "git", "github", "deploy", "open source", "opensource", "developer"];
const STARTUP_KW = ["startup", "saas", "indie", "indie hackers", "buildinpublic", "launch", "product", "founder", "vc", "sideproject"];

function categorizeTrend(name: string): "Tech" | "AI" | "Dev" | "Startup" | "General" {
  const lower = name.toLowerCase();
  if (AI_KEYWORDS.some((k) => lower.includes(k))) return "AI";
  if (STARTUP_KW.some((k) => lower.includes(k))) return "Startup";
  if (DEV_KW.some((k) => lower.includes(k))) return "Dev";
  if (TECH_KEYWORDS.some((k) => lower.includes(k))) return "Tech";
  return "General";
}

function enrichTrends(raw: RawTrend[]): Trend[] {
  return raw.map((t, i) => ({
    ...t,
    rank: i + 1,
    category: categorizeTrend(t.name),
    relevance: scoreTrend(t.name),
  }));
}

function formatVolume(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M tweets`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}K tweets`;
  if (v === 0) return "trending";
  return `${v} tweets`;
}

// ─── Placeholders ─────────────────────────────────────────────────────────────

const TREND_METHODOLOGY = `Trend-jacking is the art of inserting your brand into trending conversations at exactly the right moment. When a topic is peaking, there's a massive amplification window — tweets about trending topics get 3-8× more impressions than baseline content.

The strategy: identify which trending topics overlap with your audience's interests, then create authentic, value-adding content that rides the wave without feeling forced. The goal isn't to hijack — it's to genuinely participate.

For Blueprint OS, we target developer and startup trends. When #TypeScript trends, we talk about how Blueprint simplifies TS setups. When #BuildInPublic trends, we share what we're shipping. When #AITools trends, we show how Blueprint integrates AI into workflows.

**The window is narrow.** A trend peaks and fades in 2-6 hours. The "Best trend to act on" section shows you exactly what to post about right now.`;

// ─── Badge helpers ────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  AI:      { bg: "rgba(191,90,242,0.12)", border: "rgba(191,90,242,0.3)", text: "#bf5af2" },
  Tech:    { bg: "rgba(10,132,255,0.12)", border: "rgba(10,132,255,0.3)", text: "#5ac8fa" },
  Dev:     { bg: "rgba(48,209,88,0.12)",  border: "rgba(48,209,88,0.3)",  text: "#30d158" },
  Startup: { bg: "rgba(255,159,10,0.12)", border: "rgba(255,159,10,0.3)", text: "#ff9f0a" },
  General: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "#8e8e93" },
};

const RELEVANCE_STYLES = {
  high:   { bg: "rgba(48,209,88,0.12)",  border: "rgba(48,209,88,0.3)",  text: "#30d158",  label: "High" },
  medium: { bg: "rgba(255,159,10,0.12)", border: "rgba(255,159,10,0.3)", text: "#ff9f0a",  label: "Medium" },
  low:    { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "#636366", label: "Low" },
};

// ─── Trend Card ───────────────────────────────────────────────────────────────

function TrendCard({ trend, onCreatePost }: { trend: Trend; onCreatePost: (t: Trend) => void }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORY_STYLES[trend.category] ?? CATEGORY_STYLES.General!;
  const rel = RELEVANCE_STYLES[trend.relevance];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 cursor-default"
      style={{
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rank */}
      <span
        className="text-[13px] font-semibold w-7 flex-shrink-0 text-right"
        style={{ color: "#48484a" }}
      >
        #{trend.rank}
      </span>

      {/* Name + badges */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium truncate" style={{ color: "#f5f5f7" }}>
          {trend.name}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: "#636366" }}>
          {formatVolume(trend.tweet_volume)}
        </p>
      </div>

      {/* Category badge */}
      <span
        className="px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 hidden sm:block"
        style={{ background: cat.bg, border: `1px solid ${cat.border}`, color: cat.text }}
      >
        {trend.category}
      </span>

      {/* Relevance badge */}
      <span
        className="px-2 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0"
        style={{ background: rel.bg, border: `1px solid ${rel.border}`, color: rel.text }}
      >
        {rel.label}
      </span>

      {/* CTA */}
      <button
        onClick={() => onCreatePost(trend)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 flex-shrink-0"
        style={{
          background: hovered ? "rgba(10,132,255,0.18)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${hovered ? "rgba(10,132,255,0.3)" : "rgba(255,255,255,0.08)"}`,
          color: hovered ? "#5ac8fa" : "#8e8e93",
        }}
      >
        Create Post
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Opportunity Score ────────────────────────────────────────────────────────

function OpportunityScore({ trends }: { trends: Trend[] }) {
  const high = trends.filter((t) => t.relevance === "high").length;
  const medium = trends.filter((t) => t.relevance === "medium").length;
  const score = Math.round(((high * 3 + medium * 1.5) / (trends.length * 3)) * 100);

  const color =
    score >= 60 ? "#30d158" : score >= 30 ? "#ff9f0a" : "#636366";

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
          Opportunity Score
        </p>
        <Target className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-[32px] font-bold leading-none" style={{ color }}>
          {score}
        </span>
        <span className="text-[16px] mb-0.5" style={{ color: "#48484a" }}>/100</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <p className="text-[11px] mt-2" style={{ color: "#636366" }}>
        {high} high-relevance · {medium} medium-relevance trends right now
      </p>
    </div>
  );
}

// ─── Best Trend ───────────────────────────────────────────────────────────────

function BestTrend({ trend, onCreatePost }: { trend: Trend | null; onCreatePost: (t: Trend) => void }) {
  if (!trend) return null;
  const rel = RELEVANCE_STYLES[trend.relevance];

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(10,132,255,0.08)",
        border: "1px solid rgba(10,132,255,0.2)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-3.5 h-3.5" style={{ color: "#0a84ff" }} />
        <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#0a84ff" }}>
          Best Trend to Act On
        </p>
      </div>
      <p className="text-[18px] font-bold mb-1" style={{ color: "#f5f5f7" }}>
        {trend.name}
      </p>
      <p className="text-[12px] mb-3" style={{ color: "#8e8e93" }}>
        {formatVolume(trend.tweet_volume)} · ranked #{trend.rank}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{ background: rel.bg, border: `1px solid ${rel.border}`, color: rel.text }}
        >
          {rel.label} relevance
        </span>
        <button
          onClick={() => onCreatePost(trend)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
          style={{ background: "#0a84ff", color: "#fff" }}
        >
          Post About This
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AUTO_REFRESH_SECONDS = 300; // 5 minutes

export function TrendsClient() {
  const router = useRouter();

  const [trends, setTrends] = useState<Trend[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS);
  const [spinning, setSpinning] = useState(false);
  const countdownRef = useRef(AUTO_REFRESH_SECONDS);
  const autoRefreshRef = useRef(true);

  const fetchTrends = useCallback(async () => {
    setSpinning(true);
    try {
      const res = await fetch("/api/twitter/trends", { cache: "no-store" });
      const data = (await res.json()) as { trends: RawTrend[]; fetchedAt: string };
      setTrends(enrichTrends(data.trends));
      setFetchedAt(data.fetchedAt);
    } catch {
      // silently fail — mock data will have loaded
    } finally {
      setLoading(false);
      setSpinning(false);
      countdownRef.current = AUTO_REFRESH_SECONDS;
      setCountdown(AUTO_REFRESH_SECONDS);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    void fetchTrends();
  }, [fetchTrends]);

  // Countdown + auto-refresh tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoRefreshRef.current) return;
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);
      if (countdownRef.current <= 0) {
        void fetchTrends();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchTrends]);

  const handleToggleAutoRefresh = () => {
    setAutoRefresh((v) => {
      autoRefreshRef.current = !v;
      return !v;
    });
  };

  const handleCreatePost = useCallback(
    (trend: Trend) => {
      const trendSlug = trend.name.replace(/^#/, "");
      router.push(`/compose?trend=${encodeURIComponent(trendSlug)}`);
    },
    [router]
  );

  const bestTrend =
    trends.find((t) => t.relevance === "high") ??
    trends.find((t) => t.relevance === "medium") ??
    null;

  const formattedTime = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  const countdownMin = Math.floor(countdown / 60);
  const countdownSec = countdown % 60;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
          Hot Trends
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
          Live Twitter trends with relevance scoring for Blueprint OS
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        {/* ── Left: Live Trends Feed ─────────────────────────────────────── */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Feed header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "#0a84ff" }} />
                <p className="text-[16px] font-semibold" style={{ color: "#f5f5f7" }}>
                  Trending Now
                </p>
              </div>
              {formattedTime && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3" style={{ color: "#48484a" }} />
                  <span className="text-[11px]" style={{ color: "#48484a" }}>
                    Updated {formattedTime}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Auto-refresh toggle */}
              <button
                onClick={handleToggleAutoRefresh}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150"
                style={{
                  background: autoRefresh ? "rgba(48,209,88,0.1)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${autoRefresh ? "rgba(48,209,88,0.25)" : "rgba(255,255,255,0.08)"}`,
                  color: autoRefresh ? "#30d158" : "#636366",
                }}
              >
                {autoRefresh ? (
                  <ToggleRight className="w-3.5 h-3.5" />
                ) : (
                  <ToggleLeft className="w-3.5 h-3.5" />
                )}
                Auto
              </button>

              {/* Manual refresh */}
              <button
                onClick={() => void fetchTrends()}
                disabled={spinning}
                className="p-2 rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{ background: "rgba(255,255,255,0.06)", color: "#8e8e93" }}
                title="Refresh now"
              >
                <RefreshCw
                  className="w-3.5 h-3.5 transition-transform duration-500"
                  style={{ transform: spinning ? "rotate(360deg)" : "rotate(0deg)" }}
                />
              </button>
            </div>
          </div>

          {/* Countdown */}
          {autoRefresh && (
            <p className="text-[11px] mb-4" style={{ color: "#48484a" }}>
              Next refresh in {countdownMin}:{String(countdownSec).padStart(2, "0")}
            </p>
          )}
          {!autoRefresh && <div className="mb-4" />}

          {/* Trend cards */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {trends.map((trend) => (
                <TrendCard key={trend.rank} trend={trend} onCreatePost={handleCreatePost} />
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Trend Intelligence ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Opportunity Score */}
          {!loading && trends.length > 0 && <OpportunityScore trends={trends} />}

          {/* Best Trend */}
          {!loading && bestTrend && (
            <BestTrend trend={bestTrend} onCreatePost={handleCreatePost} />
          )}

          {/* Why These Matter */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(28,28,30,0.82)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[13px] font-semibold mb-3" style={{ color: "#f5f5f7" }}>
              Why These Matter
            </p>
            <div className="space-y-2 text-[12px] leading-relaxed" style={{ color: "#8e8e93" }}>
              {TREND_METHODOLOGY.split("\n\n").map((para, i) => (
                <p key={i}>
                  {para.startsWith("**") ? (
                    <>
                      <span className="font-semibold" style={{ color: "#e5e5ea" }}>
                        {para.replace(/\*\*/g, "").split(".")[0]}.
                      </span>
                      {" " + para.replace(/\*\*/g, "").split(".").slice(1).join(".")}
                    </>
                  ) : (
                    para
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
