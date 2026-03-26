"use client";

import { useState, useCallback } from "react";
import { RefreshCw, ChevronUp, ChevronDown, X, Plus, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  id: number;
  type: "Single" | "Thread";
  strategy: string;
  hook: string;
  threadTweets?: string[];
}

interface TweetBox {
  id: string;
  text: string;
}

// ─── Suggestion batches ───────────────────────────────────────────────────────

const SUGGESTION_BATCHES: Suggestion[][] = [
  // Batch 1
  [
    {
      id: 1,
      type: "Thread",
      strategy: "Feature Spotlight",
      hook: "5 things you can build with Blueprint OS in under 10 minutes 🧵",
      threadTweets: [
        "5 things you can build with Blueprint OS in under 10 minutes 🧵",
        "1/ A fully custom window manager — drag, snap, and tile windows your way. No plugins needed.",
        "2/ A dev environment that launches in one click. Clone, configure, run — Blueprint handles the rest.",
        "3/ A marketing dashboard (like this one) with real-time analytics and AI post suggestions.",
        "4/ A multi-app workspace that remembers your layout across reboots.",
        "5/ Ship a full-stack product and monitor it — all from one unified OS. /end",
      ],
    },
    {
      id: 2,
      type: "Single",
      strategy: "Behind the Scenes",
      hook: "We just shipped drag-and-drop windows on Blueprint OS. Here's what that took 👇",
    },
    {
      id: 3,
      type: "Thread",
      strategy: "Developer Education",
      hook: "Why we built Blueprint as a monorepo (and why you should too) 🧵",
      threadTweets: [
        "Why we built Blueprint as a monorepo (and why you should too) 🧵",
        "1/ One repo = one truth. No version drift between packages. Everything is always in sync.",
        "2/ Turborepo caches builds intelligently — only rebuild what changed. Faster CI, happier devs.",
        "3/ Shared config files (ESLint, TS, Tailwind) mean consistency across 10+ apps without copy-paste hell.",
        "4/ New team members clone once and run one command. Done. The monorepo is the onboarding doc.",
        "Still not convinced? Try maintaining 6 separate repos for 6 months. You'll come back. 😅 /end",
      ],
    },
    {
      id: 4,
      type: "Single",
      strategy: "Social Proof",
      hook: "Blueprint OS now has a marketing dashboard powered by AI. Built it in one day.",
    },
    {
      id: 5,
      type: "Single",
      strategy: "Engagement",
      hook: "What would you want to see in a developer OS? Drop it below 👇",
    },
  ],
  // Batch 2
  [
    {
      id: 6,
      type: "Single",
      strategy: "Product Launch",
      hook: "Blueprint OS v2 just dropped. The OS built for builders is now faster, sharper, and open to everyone.",
    },
    {
      id: 7,
      type: "Thread",
      strategy: "How It Works",
      hook: "How Blueprint OS handles multi-app workspaces — a deep dive 🧵",
      threadTweets: [
        "How Blueprint OS handles multi-app workspaces — a deep dive 🧵",
        "1/ Every workspace is a snapshot: open apps, window positions, active tabs — all saved automatically.",
        "2/ Switch between workspaces in one keystroke. No drag-and-drop chaos. Pure muscle memory.",
        "3/ Workspaces sync across devices. Start on your desktop, continue on your laptop. Zero friction.",
        "4/ You can name and colour-code each workspace. Design, Dev, Ops — always one click away.",
        "5/ This is what productivity looks like when the OS is designed around YOUR workflow. /end",
      ],
    },
    {
      id: 8,
      type: "Single",
      strategy: "Founder Voice",
      hook: "We started Blueprint OS because we were tired of context-switching between 12 tools. Turns out, a lot of devs were too.",
    },
    {
      id: 9,
      type: "Single",
      strategy: "Stats & Proof",
      hook: "Devs using Blueprint OS report saving ~45 min/day on environment setup and context switching. That's 3+ hours a week back.",
    },
    {
      id: 10,
      type: "Thread",
      strategy: "Comparison",
      hook: "Blueprint OS vs. a normal dev setup. Here's what we actually fixed 🧵",
      threadTweets: [
        "Blueprint OS vs. a normal dev setup. Here's what we actually fixed 🧵",
        "1/ Normal: 4 terminal windows, 2 browsers, 3 IDEs open. Blueprint: one unified interface, zero chaos.",
        "2/ Normal: Env setup takes 30 min on a new machine. Blueprint: one config file, one command, done.",
        "3/ Normal: App switching destroys your mental context. Blueprint: workspaces keep your brain in flow.",
        "4/ Normal: Monitoring is a different tool, different tab, different login. Blueprint: it's built in.",
        "We're not replacing your tools. We're giving them a home. /end",
      ],
    },
  ],
  // Batch 3
  [
    {
      id: 11,
      type: "Single",
      strategy: "Community",
      hook: "Open question for devs: what's the most painful part of your daily workflow? Ours was env setup. What's yours?",
    },
    {
      id: 12,
      type: "Thread",
      strategy: "Vision",
      hook: "What we're building toward with Blueprint OS 🧵",
      threadTweets: [
        "What we're building toward with Blueprint OS 🧵",
        "1/ An OS that understands your project — not just your files, but your context, goals, and team.",
        "2/ An AI layer that surfaces what you need before you search for it.",
        "3/ A deployment pipeline that lives next to your editor, not in a separate dashboard across the internet.",
        "4/ A workspace that travels with you — same layout, same context, same productivity on any machine.",
        "5/ We're still early. But the blueprint is drawn. Come build it with us. /end",
      ],
    },
    {
      id: 13,
      type: "Single",
      strategy: "Milestone",
      hook: "1,000 devs have now run Blueprint OS in production. Wild. Thank you 🙏",
    },
    {
      id: 14,
      type: "Single",
      strategy: "Hot Take",
      hook: "Hot take: your OS should know what project you're working on and configure itself accordingly. We built that.",
    },
    {
      id: 15,
      type: "Thread",
      strategy: "Tutorial",
      hook: "Set up a full dev environment on Blueprint OS in under 5 minutes 🧵",
      threadTweets: [
        "Set up a full dev environment on Blueprint OS in under 5 minutes 🧵",
        "1/ Install Blueprint OS. It takes 2 minutes. Seriously — we timed it.",
        "2/ Clone your repo. Blueprint detects your stack automatically (Node, Python, Go — you name it).",
        "3/ Hit 'Run'. It installs deps, sets env vars from your .env.example, and starts your dev server.",
        "4/ Open the built-in terminal and editor side-by-side. No config. No setup. Just code.",
        "5/ Save the workspace. Next time you open Blueprint, everything's exactly where you left it. /end",
      ],
    },
  ],
];

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  type: "success" | "error";
  link?: string;
  onDismiss: () => void;
}

function Toast({ message, type, link, onDismiss }: ToastProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl max-w-sm"
      style={{
        background: type === "success" ? "rgba(48,209,88,0.15)" : "rgba(255,69,58,0.15)",
        border: `1px solid ${type === "success" ? "rgba(48,209,88,0.3)" : "rgba(255,69,58,0.3)"}`,
        backdropFilter: "blur(20px)",
      }}
    >
      <span className="text-[13px] font-medium" style={{ color: "#f5f5f7" }}>
        {message}
      </span>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] underline flex-shrink-0"
          style={{ color: "#0a84ff" }}
        >
          View →
        </a>
      )}
      <button onClick={onDismiss} className="flex-shrink-0 ml-1">
        <X className="w-3.5 h-3.5" style={{ color: "#636366" }} />
      </button>
    </div>
  );
}

// ─── Suggestion Card ──────────────────────────────────────────────────────────

function SuggestionCard({
  suggestion,
  onUse,
}: {
  suggestion: Suggestion;
  onUse: (s: Suggestion) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const badgeColor =
    suggestion.type === "Thread"
      ? { bg: "rgba(10,132,255,0.12)", border: "rgba(10,132,255,0.25)", text: "#5ac8fa" }
      : { bg: "rgba(48,209,88,0.12)", border: "rgba(48,209,88,0.25)", text: "#30d158" };

  return (
    <div
      className="relative rounded-xl p-4 cursor-default transition-all duration-150"
      style={{
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
          style={{
            background: badgeColor.bg,
            border: `1px solid ${badgeColor.border}`,
            color: badgeColor.text,
          }}
        >
          {suggestion.type}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#8e8e93",
          }}
        >
          {suggestion.strategy}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#e5e5ea" }}>
        {suggestion.hook}
      </p>
      <button
        onClick={() => onUse(suggestion)}
        className={cn(
          "text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150",
          hovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "rgba(10,132,255,0.15)",
          border: "1px solid rgba(10,132,255,0.25)",
          color: "#5ac8fa",
        }}
      >
        Use This →
      </button>
    </div>
  );
}

// ─── Thread Tweet Box ─────────────────────────────────────────────────────────

function ThreadTweetBox({
  tweet,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  tweet: TweetBox;
  index: number;
  total: number;
  onChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  const count = tweet.text.length;
  const isNearLimit = count > 240;
  const isOver = count > 280;

  return (
    <div className="flex gap-3">
      {/* Thread connector line */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 24 }}>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
          style={{
            background: "rgba(10,132,255,0.15)",
            border: "1px solid rgba(10,132,255,0.3)",
            color: "#5ac8fa",
          }}
        >
          {index + 1}
        </div>
        {index < total - 1 && (
          <div
            className="flex-1 mt-1"
            style={{
              width: 2,
              background: "rgba(255,255,255,0.15)",
              minHeight: 20,
            }}
          />
        )}
      </div>

      {/* Tweet content */}
      <div className="flex-1 mb-3">
        <div
          className="rounded-xl p-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${isOver ? "rgba(255,69,58,0.4)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          <textarea
            value={tweet.text}
            onChange={(e) => onChange(tweet.id, e.target.value)}
            placeholder={index === 0 ? "Start your thread…" : `Tweet ${index + 1}…`}
            rows={3}
            className="w-full resize-none bg-transparent text-[13px] leading-relaxed outline-none"
            style={{ color: "#f5f5f7" }}
          />
          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[11px] font-medium"
              style={{ color: isOver ? "#ff453a" : isNearLimit ? "#ff9f0a" : "#636366" }}
            >
              {count}/280
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onMoveUp(tweet.id)}
                disabled={index === 0}
                className="p-1 rounded transition-all duration-100 disabled:opacity-20"
                style={{ color: "#8e8e93" }}
                title="Move up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onMoveDown(tweet.id)}
                disabled={index === total - 1}
                className="p-1 rounded transition-all duration-100 disabled:opacity-20"
                style={{ color: "#8e8e93" }}
                title="Move down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {total > 2 && (
                <button
                  onClick={() => onRemove(tweet.id)}
                  className="p-1 rounded transition-all duration-100 ml-1"
                  style={{ color: "#ff453a" }}
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Single Composer ──────────────────────────────────────────────────────────

function SingleComposer({
  text,
  onChange,
  onPost,
  posting,
}: {
  text: string;
  onChange: (t: string) => void;
  onPost: () => void;
  posting: boolean;
}) {
  const count = text.length;
  const isNearLimit = count > 240;
  const isOver = count > 280;

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${isOver ? "rgba(255,69,58,0.4)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's happening with Blueprint OS?"
          rows={5}
          className="w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none"
          style={{ color: "#f5f5f7" }}
        />
        <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4" style={{ color: "#1d9bf0" }} />
            <span className="text-[12px]" style={{ color: "#636366" }}>Twitter / X</span>
          </div>
          <span
            className="text-[12px] font-medium"
            style={{ color: isOver ? "#ff453a" : isNearLimit ? "#ff9f0a" : "#636366" }}
          >
            {count} / 280
          </span>
        </div>
      </div>

      {/* Tweet preview */}
      {text.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "#48484a", letterSpacing: "0.08em" }}>
            Preview
          </p>
          <div className="flex gap-3">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[14px] font-bold"
              style={{ background: "#1d9bf0", color: "#fff" }}
            >
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>Blueprint OS</span>
                <span className="text-[12px]" style={{ color: "#636366" }}>@blueprint_os</span>
              </div>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "#e5e5ea" }}>
                {text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPost}
          disabled={posting || !text.trim() || isOver}
          className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#1d9bf0", color: "#fff" }}
        >
          {posting ? "Posting…" : "Post Now"}
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-[13px] font-medium cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#48484a",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          title="Scheduling coming soon"
        >
          Schedule ▾
        </button>
      </div>
    </div>
  );
}

// ─── Thread Composer ──────────────────────────────────────────────────────────

function ThreadComposer({
  tweets,
  onChange,
  onAdd,
  onRemove,
  onMoveUp,
  onMoveDown,
  onPost,
  posting,
}: {
  tweets: TweetBox[];
  onChange: (id: string, text: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onPost: () => void;
  posting: boolean;
}) {
  const hasOverLimit = tweets.some((t) => t.text.length > 280);
  const hasEmpty = tweets.some((t) => !t.text.trim());

  return (
    <div className="space-y-2">
      {tweets.map((tweet, index) => (
        <ThreadTweetBox
          key={tweet.id}
          tweet={tweet}
          index={index}
          total={tweets.length}
          onChange={onChange}
          onRemove={onRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ml-9"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px dashed rgba(255,255,255,0.12)",
          color: "#8e8e93",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Tweet
      </button>

      <div className="flex items-center gap-2 pt-2 ml-9">
        <button
          onClick={onPost}
          disabled={posting || hasOverLimit || hasEmpty}
          className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#1d9bf0", color: "#fff" }}
        >
          {posting ? "Posting thread…" : `Post Thread (${tweets.length})`}
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-[13px] font-medium cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#48484a",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          title="Scheduling coming soon"
        >
          Schedule ▾
        </button>
      </div>
    </div>
  );
}

// ─── Main Compose Client ──────────────────────────────────────────────────────

function makeId() {
  return Math.random().toString(36).slice(2);
}

export function ComposeClient() {
  const [mode, setMode] = useState<"single" | "thread">("single");
  const [singleText, setSingleText] = useState("");
  const [threadTweets, setThreadTweets] = useState<TweetBox[]>([
    { id: makeId(), text: "" },
    { id: makeId(), text: "" },
  ]);
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [refreshSpinning, setRefreshSpinning] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);

  const handleRefreshSuggestions = useCallback(() => {
    if (refreshSpinning) return;
    setRefreshSpinning(true);
    setSuggestionsVisible(false);
    setTimeout(() => {
      setBatchIndex((prev) => (prev + 1) % SUGGESTION_BATCHES.length);
      setSuggestionsVisible(true);
      setRefreshSpinning(false);
    }, 300);
  }, [refreshSpinning]);

  const showToast = (t: Omit<ToastProps, "onDismiss">) => {
    setToast({ ...t, onDismiss: () => setToast(null) });
    setTimeout(() => setToast(null), 5000);
  };

  const handleUseSuggestion = useCallback((suggestion: Suggestion) => {
    if (suggestion.type === "Thread" && suggestion.threadTweets) {
      setMode("thread");
      setThreadTweets(
        suggestion.threadTweets.map((text) => ({ id: makeId(), text }))
      );
    } else {
      setMode("single");
      setSingleText(suggestion.hook);
    }
  }, []);

  const handlePostSingle = async () => {
    if (!singleText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: singleText }),
      });
      const data = await res.json() as { id?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Post failed");
      showToast({
        message: "Posted! View on Twitter →",
        type: "success",
        link: data.id ? `https://twitter.com/blueprint_os/status/${data.id}` : undefined,
      });
      setSingleText("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post";
      showToast({ message: msg, type: "error" });
    } finally {
      setPosting(false);
    }
  };

  const handlePostThread = async () => {
    setPosting(true);
    try {
      let lastId: string | undefined;
      for (const tweet of threadTweets) {
        const payload: { text: string; replyToId?: string } = { text: tweet.text };
        if (lastId) payload.replyToId = lastId;
        const res = await fetch("/api/twitter/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { id?: string; error?: string };
        if (!res.ok || data.error) throw new Error(data.error ?? "Post failed");
        lastId = data.id;
      }
      showToast({
        message: `Thread posted! (${threadTweets.length} tweets)`,
        type: "success",
        link: `https://twitter.com/blueprint_os`,
      });
      setThreadTweets([{ id: makeId(), text: "" }, { id: makeId(), text: "" }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to post thread";
      showToast({ message: msg, type: "error" });
    } finally {
      setPosting(false);
    }
  };

  // Thread operations
  const handleThreadChange = (id: string, text: string) =>
    setThreadTweets((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  const handleThreadAdd = () =>
    setThreadTweets((prev) => [...prev, { id: makeId(), text: "" }]);
  const handleThreadRemove = (id: string) =>
    setThreadTweets((prev) => prev.length > 2 ? prev.filter((t) => t.id !== id) : prev);
  const handleThreadMoveUp = (id: string) =>
    setThreadTweets((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const tmp = next[idx - 1]!;
      next[idx - 1] = next[idx]!;
      next[idx] = tmp;
      return next;
    });
  const handleThreadMoveDown = (id: string) =>
    setThreadTweets((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      const tmp = next[idx + 1]!;
      next[idx + 1] = next[idx]!;
      next[idx] = tmp;
      return next;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold" style={{ color: "#f5f5f7", letterSpacing: "-0.02em" }}>
          Compose
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: "#636366" }}>
          AI-assisted post creation with thread support
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: AI Suggestions */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold" style={{ color: "#f5f5f7" }}>
                Post Ideas
              </p>
              <span
                className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#636366",
                }}
              >
                {batchIndex + 1}/{SUGGESTION_BATCHES.length}
              </span>
            </div>
            <button
              className="p-2 rounded-lg transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.06)", color: "#8e8e93" }}
              title="Next batch of suggestions"
              onClick={handleRefreshSuggestions}
            >
              <RefreshCw
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{ transform: refreshSpinning ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>
          </div>
          <div
            className="space-y-3 transition-opacity duration-200"
            style={{ opacity: suggestionsVisible ? 1 : 0 }}
          >
            {SUGGESTION_BATCHES[batchIndex]!.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onUse={handleUseSuggestion} />
            ))}
          </div>
        </div>

        {/* Right: Composer */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Mode toggle */}
          <div className="flex mb-5">
            <div
              className="flex gap-0.5 p-0.5 rounded-lg"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {(["single", "thread"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150"
                  style={
                    mode === m
                      ? { background: "#2c2c2e", color: "#f5f5f7", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }
                      : { color: "#636366" }
                  }
                >
                  {m === "single" ? "Single Post" : "Thread"}
                </button>
              ))}
            </div>
          </div>

          {mode === "single" ? (
            <SingleComposer
              text={singleText}
              onChange={setSingleText}
              onPost={handlePostSingle}
              posting={posting}
            />
          ) : (
            <ThreadComposer
              tweets={threadTweets}
              onChange={handleThreadChange}
              onAdd={handleThreadAdd}
              onRemove={handleThreadRemove}
              onMoveUp={handleThreadMoveUp}
              onMoveDown={handleThreadMoveDown}
              onPost={handlePostThread}
              posting={posting}
            />
          )}
        </div>
      </div>

      {toast && <Toast {...toast} />}
    </div>
  );
}
