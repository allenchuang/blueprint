"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { RefreshCw, ChevronUp, ChevronDown, X, Plus, Twitter, ChevronRight, ChevronDown as ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingWizard } from "./onboarding-wizard";

// ─── Contenteditable placeholder styles ──────────────────────────────────────

const TWEET_EDITOR_CSS = `
.tweet-editor:empty::before {
  content: attr(data-placeholder);
  color: #71767b;
  pointer-events: none;
}
.tweet-editor:focus {
  outline: 2px solid #1d9bf0;
  border-radius: 4px;
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface TwitterAccountInfo {
  id: string;
  username: string;
  displayName: string;
}

interface Draft {
  id: string;
  filename: string;
  title: string;
  tweets: string[];
  notes: string;
  createdAt: string;
}

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
  // Batch 1 — Skylar
  [
    {
      id: 1,
      type: "Thread",
      strategy: "Developer Education",
      hook: "Most dev platforms give you a frontend. Blueprint OS gives you a full stack — in one repo. Here's what that actually means:",
      threadTweets: [
        "Most dev platforms give you a frontend. Blueprint OS gives you a full stack — in one repo. Here's what that actually means:",
        "Next.js 15 handles your web app. Fastify runs your API. Drizzle + Neon manages your Postgres. Expo ships your mobile app. Remotion renders your videos. All in one monorepo, one deploy pipeline.",
        "You don't context-switch between 5 different repos, 5 different CI configs, 5 different deploy dashboards. You open one thing and ship.",
        "The macOS-style browser interface makes it feel like an OS — because navigating a complex stack should feel like navigating a desktop, not a wiki.",
        "Ash (the built-in AI) knows your whole stack. Ask it to write an API route, a DB migration, a mobile screen. It has context because it lives inside your project.",
      ],
    },
    {
      id: 2,
      type: "Single",
      strategy: "Feature Spotlight",
      hook: "Your AI assistant shouldn't need a README to understand your project. Ash is built into Blueprint OS — it knows your schema, your routes, your components. Context-aware from day one.",
    },
    {
      id: 3,
      type: "Single",
      strategy: "Engagement",
      hook: "What's the most painful part of starting a new full-stack project? Setting up auth, configuring the monorepo, wiring up the DB, scaffolding the mobile app... We built Blueprint OS to skip all of that. Curious what kills your momentum most.",
    },
    {
      id: 4,
      type: "Thread",
      strategy: "Behind the Scenes",
      hook: "Blueprint OS looks like a desktop OS in your browser. Here's why we built it that way:",
      threadTweets: [
        "Blueprint OS looks like a desktop OS in your browser. Here's why we built it that way:",
        "When you're running a full-stack app, you have a lot of windows open. API logs. DB explorer. Component previews. Video renderer. A traditional dashboard turns this into a tab/sidebar nightmare.",
        "A windowed, macOS-style interface is the right metaphor for complex tooling. You resize, tile, minimize. You work the way you work.",
        "It's not a gimmick. It's a productivity decision. The OS interface means you can context-switch without losing state. Everything stays open, positioned how you left it.",
        "Plus, if you're building developer tools, you should probably make them look good.",
      ],
    },
    {
      id: 5,
      type: "Single",
      strategy: "Growth Hack",
      hook: "Ship a full-stack app — web, API, mobile, DB — without leaving one repo. Blueprint OS: Next.js 15 + Fastify + Drizzle + Neon + Expo + Remotion, all wired up. Built for indie devs who don't want to spend 3 days on setup.",
    },
  ],
  // Batch 2 — Skylar
  [
    {
      id: 6,
      type: "Thread",
      strategy: "Developer Education",
      hook: "Why we chose Drizzle over Prisma for Blueprint OS:",
      threadTweets: [
        "Why we chose Drizzle over Prisma for Blueprint OS:",
        "Prisma is great, but the generated client is heavy and the runtime behavior can surprise you in edge environments. Drizzle is SQL-first, lightweight, and fully type-safe.",
        "With Neon's serverless Postgres driver, Drizzle queries stay fast in cold-start environments. No connection pool overhead, no 400ms startup tax.",
        "Migrations are just TypeScript files. You read them, you understand them. No black-box diff engine deciding what to drop.",
        "If you care about what SQL actually runs against your DB — and you should — Drizzle makes that obvious. That's the right default for a platform people ship production apps with.",
      ],
    },
    {
      id: 7,
      type: "Single",
      strategy: "Feature Spotlight",
      hook: "Remotion is in the monorepo because video shouldn't be an afterthought. Blueprint OS has a built-in video renderer — React components → MP4, server-rendered, scriptable. Build your changelog video the same way you build your UI.",
    },
    {
      id: 8,
      type: "Single",
      strategy: "Engagement",
      hook: "Hot take: the hardest part of building a startup isn't the product — it's the tooling overhead before you can write your first line of real code. Do you set up auth first or the DB? Monorepo or not? Mobile from day one? Disagree?",
    },
    {
      id: 9,
      type: "Thread",
      strategy: "Behind the Scenes",
      hook: "We spent two weeks arguing about whether to include Expo in the default stack. Here's how we settled it:",
      threadTweets: [
        "We spent two weeks arguing about whether to include Expo in the default stack. Here's how we settled it:",
        "Argument against: most indie devs don't need mobile on day one. It adds complexity. Keep the stack lean.",
        "Argument for: by the time you want mobile, migrating a monorepo to include it is painful. Better to have the structure from the start, even if you ignore the `apps/mobile` folder.",
        "We went with it — but Expo is opt-in at runtime. The scaffold is there, zero config required, but it doesn't slow down your web-only build.",
        "Right call? We think so. A platform shouldn't make you choose between now and later.",
      ],
    },
    {
      id: 10,
      type: "Single",
      strategy: "Social Proof",
      hook: "The best feedback we've gotten so far: 'I stopped dreading the scaffolding phase.' That's what Blueprint OS is for — so you spend your energy on the thing only you can build, not the infrastructure anyone could copy.",
    },
  ],
  // Batch 3 — Skylar
  [
    {
      id: 11,
      type: "Thread",
      strategy: "Feature Spotlight",
      hook: "Ash isn't a chatbot bolted onto your IDE. It's an AI that lives inside your stack. Here's the difference:",
      threadTweets: [
        "Ash isn't a chatbot bolted onto your IDE. It's an AI that lives inside your stack. Here's the difference:",
        "Most AI coding tools operate outside your project. You paste code in, get suggestions back, paste it out. The model has no idea what your schema looks like or how your routes are structured.",
        "Ash knows your Blueprint OS project. It has access to your file tree, your DB schema, your API routes. It's not guessing — it's reading the same source of truth you are.",
        "Ask it to add a column to a table: it writes the migration, updates the Drizzle schema, and updates the type in your API handler. One ask, coherent change.",
        "That's what it means to have an AI that's part of your stack, not just adjacent to it.",
      ],
    },
    {
      id: 12,
      type: "Single",
      strategy: "Growth Hack",
      hook: "Next.js 15 + Fastify API + Neon Postgres + Expo + Remotion video + an AI that knows your codebase. Blueprint OS is the stack for indie devs who want to ship, not configure. What are you building?",
    },
    {
      id: 13,
      type: "Single",
      strategy: "Engagement",
      hook: "If you had to cut one thing from the modern full-stack, what goes first? Mobile? Video? The ORM? The API layer? Genuinely curious what people consider essential vs. overhead in 2025.",
    },
    {
      id: 14,
      type: "Thread",
      strategy: "Developer Education",
      hook: "Fastify over Express in 2025 — here's why Blueprint OS made that call:",
      threadTweets: [
        "Fastify over Express in 2025 — here's why Blueprint OS made that call:",
        "Express has a massive ecosystem, but it's showing its age. No native TypeScript, no schema validation built in, serialization is your problem.",
        "Fastify has JSON Schema validation baked in, a plugin system that doesn't fight you, and it's measurably faster under load. It's also TypeScript-native.",
        "For a platform where you're exposing APIs to both a web app and a mobile app, the built-in request/response validation matters a lot. Fastify makes it declarative.",
        "The tradeoff: slightly smaller ecosystem than Express. Worth it for the type safety alone. Your Expo app and Next.js app will thank you.",
      ],
    },
    {
      id: 15,
      type: "Single",
      strategy: "Behind the Scenes",
      hook: "Blueprint OS runs as a macOS-style interface in your browser. The irony: building it required the most un-glamorous engineering work we've done — window management, focus stacks, drag state, z-index math. Turns out 'it looks like macOS' is harder than it sounds. 🖥️",
    },
  ],
];

// ─── Twitter-style Preview Components ────────────────────────────────────────

function TwitterAvatar({ url }: { url?: string | null }) {
  if (url) {
    return <img src={url} alt="@blueprint_os" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#1d9bf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      B
    </div>
  );
}

function TwitterTweetHeader({ displayName, username }: { displayName?: string; username?: string }) {
  const name = displayName ?? 'Blueprint OS';
  const handle = username ?? 'blueprint_os';
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3, flexWrap: "wrap" }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#e7e9ea", lineHeight: 1.3 }}>{name}</span>
      <span style={{ fontSize: 15, color: "#71767b" }}>@{handle}</span>
      <span style={{ color: "#71767b", fontSize: 15 }}>·</span>
      <span style={{ fontSize: 15, color: "#71767b" }}>now</span>
    </div>
  );
}

function TwitterActions() {
  return (
    <div style={{ display: "flex", gap: 32, marginTop: 10, color: "#71767b", fontSize: 13, userSelect: "none" }}>
      {[
        { icon: "💬", label: "Reply" },
        { icon: "🔁", label: "Repost" },
        { icon: "❤️", label: "Like" },
        { icon: "📊", label: "Views" },
      ].map(({ icon, label }) => (
        <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "default" }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 13, color: "#71767b" }}>{label}</span>
        </span>
      ))}
    </div>
  );
}

function ContentEditable({ text, onChange, className, placeholder, style }: {
  text: string;
  onChange?: (t: string) => void;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  // Set initial content on mount only
  useEffect(() => {
    if (ref.current && !isFocused.current) {
      ref.current.innerHTML = text.replace(/\n/g, "<br>");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — only run on mount

  // Sync external changes (e.g. loading a draft) but not during typing
  const prevText = useRef(text);
  useEffect(() => {
    if (ref.current && !isFocused.current && text !== prevText.current) {
      ref.current.innerHTML = text.replace(/\n/g, "<br>");
    }
    prevText.current = text;
  }, [text]);

  return (
    <div
      ref={ref}
      contentEditable={!!onChange}
      suppressContentEditableWarning
      className={className}
      data-placeholder={placeholder}
      onFocus={() => { isFocused.current = true; }}
      onBlur={() => { isFocused.current = false; }}
      onInput={onChange ? (e) => onChange((e.currentTarget as HTMLDivElement).innerText) : undefined}
      style={style}
    />
  );
}

function TwitterTweetPreview({ text, avatarUrl, onChange, displayName, username }: { text: string; avatarUrl?: string | null; onChange?: (t: string) => void; displayName?: string; username?: string }) {
  return (
    <div
      style={{
        background: "#000",
        borderRadius: 12,
        padding: "16px 16px 14px",
        maxWidth: 598,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <TwitterAvatar url={avatarUrl} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <TwitterTweetHeader displayName={displayName} username={username} />
          <ContentEditable
            text={text}
            onChange={onChange}
            className={onChange ? "tweet-editor" : ""}
            placeholder="What's happening?"
            style={{
              fontSize: 15,
              lineHeight: 1.5,
              color: "#e7e9ea",
              whiteSpace: "pre-wrap",
              margin: 0,
              wordBreak: "break-word",
              minHeight: "1.5em",
              caretColor: "#1d9bf0",
              outline: "none",
            }}
          />
          <TwitterActions />
        </div>
      </div>
    </div>
  );
}

function TwitterThreadPreview({ tweets, avatarUrl, onChangeTweet, displayName, username }: { tweets: Array<{ text: string }>; avatarUrl?: string | null; onChangeTweet?: (index: number, text: string) => void; displayName?: string; username?: string }) {
  const nonEmpty = tweets.filter((t) => t.text.trim());
  const items = nonEmpty.length > 0 ? nonEmpty : tweets;

  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-wider mb-2"
        style={{ color: "#48484a", letterSpacing: "0.08em" }}
      >
        Thread Preview
      </p>
      <div
        style={{
          background: "#000",
          borderRadius: 12,
          overflow: "hidden",
          maxWidth: 598,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {items.map((tweet, i) => {
          const isLast = i === items.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "16px 16px 0 16px",
              }}
            >
              {/* Left: avatar + connector line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 40,
                }}
              >
                <TwitterAvatar url={avatarUrl} />
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: "#2f3336",
                      marginTop: 4,
                      minHeight: 24,
                    }}
                  />
                )}
              </div>

              {/* Right: tweet content */}
              <div
                style={{
                  flex: 1,
                  paddingLeft: 12,
                  paddingBottom: isLast ? 16 : 12,
                }}
              >
                <TwitterTweetHeader displayName={displayName} username={username} />
                <ContentEditable
                  text={tweet.text || ""}
                  onChange={onChangeTweet ? (t) => onChangeTweet(i, t) : undefined}
                  className={onChangeTweet ? "tweet-editor" : ""}
                  placeholder={`Tweet ${i + 1}…`}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "#e7e9ea",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    wordBreak: "break-word",
                    minHeight: "1.5em",
                    caretColor: "#1d9bf0",
                    outline: "none",
                  }}
                />
                {/* Compact actions row */}
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 10,
                    color: "#71767b",
                    fontSize: 13,
                    userSelect: "none",
                  }}
                >
                  <span style={{ cursor: "default" }}>💬</span>
                  <span style={{ cursor: "default" }}>🔁</span>
                  <span style={{ cursor: "default" }}>❤️</span>
                  <span style={{ cursor: "default" }}>📊</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Skylar Thread Preview (for DraftCard expanded view) ─────────────────────

function DraftThreadPreview({ tweets }: { tweets: string[] }) {
  return (
    <div
      style={{
        background: "#000",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {tweets.map((text, i) => {
        const isLast = i === tweets.length - 1;
        return (
          <div key={i} style={{ display: "flex", padding: "14px 14px 0 14px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
                width: 36,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#1d9bf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                B
              </div>
              {!isLast && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    background: "#2f3336",
                    marginTop: 3,
                    minHeight: 20,
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, paddingLeft: 10, paddingBottom: isLast ? 14 : 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e7e9ea" }}>Blueprint OS</span>
                <span style={{ fontSize: 12, color: "#71767b" }}>@blueprint_os</span>
                <span style={{ color: "#71767b", fontSize: 12 }}>· now</span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#e7e9ea",
                  whiteSpace: "pre-wrap",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {text}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 8,
                  color: "#71767b",
                  fontSize: 12,
                  userSelect: "none",
                }}
              >
                <span>💬</span>
                <span>🔁</span>
                <span>❤️</span>
                <span>📊</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Skylar Drafts Panel ─────────────────────────────────────────────────────

function DraftCard({
  draft,
  onLoad,
}: {
  draft: Draft;
  onLoad: (draft: Draft) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = draft.tweets[0]
    ? draft.tweets[0].slice(0, 100) + (draft.tweets[0].length > 100 ? "…" : "")
    : "";

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[13px] font-semibold truncate" style={{ color: "#f5f5f7" }}>
              {draft.title}
            </span>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "rgba(10,132,255,0.12)",
                border: "1px solid rgba(10,132,255,0.25)",
                color: "#5ac8fa",
              }}
            >
              {draft.tweets.length} tweet{draft.tweets.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: "#8e8e93" }}>
            {preview}
          </p>
        </div>
      </div>

      {/* Expanded tweets — Twitter thread style */}
      {expanded && (
        <div className="mt-3 mb-3">
          <DraftThreadPreview tweets={draft.tweets} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => onLoad(draft)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
          style={{
            background: "rgba(10,132,255,0.15)",
            border: "1px solid rgba(10,132,255,0.25)",
            color: "#5ac8fa",
          }}
        >
          Load Thread
          <ChevronRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#8e8e93",
          }}
        >
          {expanded ? "Hide" : "View"}
          <ChevronDownIcon
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
        <span className="ml-auto text-[11px]" style={{ color: "#48484a" }}>
          ☀️ Written by Skylar
        </span>
      </div>
    </div>
  );
}

function SkylarDraftsPanel({
  onLoadDraft,
}: {
  onLoadDraft: (draft: Draft) => void;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/skylar/drafts", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json() as Draft[];
        setDrafts(Array.isArray(data) ? data : []);
      } catch {
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!loading && drafts.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(28,28,30,0.82)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,200,60,0.18)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
        style={{ background: "transparent" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold" style={{ color: "#f5f5f7" }}>
            📋 Ready to Post
          </span>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,200,60,0.18)",
                border: "1px solid rgba(255,200,60,0.3)",
                color: "#ffc83c",
              }}
            >
              {drafts.length}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className="w-4 h-4 transition-transform duration-200"
          style={{
            color: "#636366",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="px-5 pb-5 space-y-3">
          {loading ? (
            <div className="text-[13px] py-2" style={{ color: "#636366" }}>
              Loading drafts…
            </div>
          ) : (
            drafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} onLoad={onLoadDraft} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

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
  avatarUrl,
  displayName,
  username,
}: {
  text: string;
  onChange: (t: string) => void;
  onPost: () => void;
  posting: boolean;
  avatarUrl?: string | null;
  displayName?: string;
  username?: string;
}) {
  const count = text.length;
  const isNearLimit = count > 240;
  const isOver = count > 280;

  return (
    <div className="space-y-4">
      {/* Editable Twitter preview — click to edit */}
      <TwitterTweetPreview text={text} avatarUrl={avatarUrl} onChange={onChange} displayName={displayName} username={username} />
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Twitter className="w-4 h-4" style={{ color: "#1d9bf0" }} />
          <span className="text-[12px]" style={{ color: "#636366" }}>Twitter / X</span>
        </div>
        <span className="text-[12px] font-medium" style={{ color: isOver ? "#ff453a" : isNearLimit ? "#ff9f0a" : "#636366" }}>
          {count} / 280
        </span>
      </div>

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
  avatarUrl,
  displayName,
  username,
}: {
  tweets: TweetBox[];
  onChange: (id: string, text: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onPost: () => void;
  posting: boolean;
  avatarUrl?: string | null;
  displayName?: string;
  username?: string;
}) {
  const hasOverLimit = tweets.some((t) => t.text.length > 280);
  const hasEmpty = tweets.some((t) => !t.text.trim());

  return (
    <div className="space-y-2">
      {/* Twitter thread preview — editable inline */}
      <TwitterThreadPreview
        tweets={tweets}
        avatarUrl={avatarUrl}
        onChangeTweet={(i, text) => {
          const tweet = tweets[i];
          if (tweet) onChange(tweet.id, text);
        }}
        displayName={displayName}
        username={username}
      />

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

function makeTrendSuggestion(trend: string): string {
  return `${trend} is trending right now — here's how Blueprint OS fits in 👇\n\n[Share your take on #${trend} and how Blueprint OS helps developers ship faster]`;
}

export function ComposeClient({ initialTrend }: { initialTrend?: string } = {}) {
  const [mode, setMode] = useState<"single" | "thread">("single");
  const [singleText, setSingleText] = useState(
    initialTrend ? makeTrendSuggestion(initialTrend) : ""
  );
  const [threadTweets, setThreadTweets] = useState<TweetBox[]>([
    { id: makeId(), text: "" },
    { id: makeId(), text: "" },
  ]);
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [batchIndex, setBatchIndex] = useState(0);
  const [refreshSpinning, setRefreshSpinning] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [activeBatches, setActiveBatches] = useState<Suggestion[][]>(SUGGESTION_BATCHES);
  const [usingSkylar, setUsingSkylar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<TwitterAccountInfo[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('blueprint_os');
  const composerRef = useRef<HTMLDivElement>(null);

  // Fetch connected Twitter accounts on mount
  useEffect(() => {
    fetch('/api/twitter/accounts')
      .then(r => r.json())
      .then((data: TwitterAccountInfo[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAccounts(data);
          setSelectedAccountId(data[0]!.id);
        }
      })
      .catch(() => {})
  }, [])

  // Fetch real Twitter avatar whenever selected account changes
  useEffect(() => {
    setAvatarUrl(null);
    fetch(`/api/twitter/avatar?accountId=${selectedAccountId}`)
      .then(r => r.json())
      .then((d: { url?: string }) => { if (d.url) setAvatarUrl(d.url) })
      .catch(() => {})
  }, [selectedAccountId])

  // Load Skylar's suggestions on mount
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/skylar/suggestions", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const raw = await res.json() as unknown[][];
        // Normalize Skylar's JSON format to match internal Suggestion shape
        const batches: Suggestion[][] = raw.map((batch) =>
          (batch as Record<string, unknown>[]).map((item, idx) => ({
            id: idx + 1,
            type: (String(item.type ?? "Single").charAt(0).toUpperCase() + String(item.type ?? "Single").slice(1)) as "Single" | "Thread",
            strategy: String(item.strategy ?? ""),
            hook: String(item.hook ?? ""),
            threadTweets: Array.isArray(item.content) ? (item.content as string[]) : undefined,
          }))
        );
        if (batches.length > 0) {
          setActiveBatches(batches);
          setUsingSkylar(true);
        }
      } catch {
        // Fall back to hardcoded batches silently
      }
    })();
  }, []);

  const handleRefreshSuggestions = useCallback(() => {
    if (refreshSpinning) return;
    setRefreshSpinning(true);
    setSuggestionsVisible(false);
    setTimeout(() => {
      setBatchIndex((prev) => (prev + 1) % activeBatches.length);
      setSuggestionsVisible(true);
      setRefreshSpinning(false);
    }, 300);
  }, [refreshSpinning, activeBatches.length]);

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

  const handleLoadDraft = useCallback((draft: Draft) => {
    setMode("thread");
    setThreadTweets(draft.tweets.map((text) => ({ id: makeId(), text })));
    // Scroll to composer
    setTimeout(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    showToast({ message: `"${draft.title}" loaded into composer`, type: "success" });
  }, []);

  const handlePostSingle = async () => {
    if (!singleText.trim()) return;
    setPosting(true);
    try {
      const selectedAccount = accounts.find(a => a.id === selectedAccountId);
      const handle = selectedAccount?.username ?? 'blueprint_os';
      const res = await fetch("/api/twitter/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: singleText, accountId: selectedAccountId }),
      });
      const data = await res.json() as { id?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Post failed");
      showToast({
        message: "Posted! View on Twitter →",
        type: "success",
        link: data.id ? `https://twitter.com/${handle}/status/${data.id}` : undefined,
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
        const payload: { text: string; replyToId?: string; accountId: string } = {
          text: tweet.text,
          accountId: selectedAccountId,
        };
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
      const selectedAccount = accounts.find(a => a.id === selectedAccountId);
      const handle = selectedAccount?.username ?? 'blueprint_os';
      showToast({
        message: `Thread posted! (${threadTweets.length} tweets)`,
        type: "success",
        link: `https://twitter.com/${handle}`,
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

      {/* Trend banner */}
      {initialTrend && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(10,132,255,0.1)",
            border: "1px solid rgba(10,132,255,0.25)",
          }}
        >
          <span className="text-[13px]" style={{ color: "#5ac8fa" }}>
            🔥 Riding the <strong>#{initialTrend}</strong> trend — edit the draft below and post it while it&apos;s hot!
          </span>
        </div>
      )}

      {/* Connect Accounts wizard */}
      <OnboardingWizard />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Skylar Drafts + AI Suggestions */}
        <div className="space-y-5">
          <SkylarDraftsPanel onLoadDraft={handleLoadDraft} />

          {/* AI Suggestions */}
          <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
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
                {batchIndex + 1}/{activeBatches.length}
              </span>
              {usingSkylar && (
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,200,60,0.12)",
                    border: "1px solid rgba(255,200,60,0.2)",
                    color: "#ffc83c",
                  }}
                >
                  ☀️ Skylar&apos;s picks
                </span>
              )}
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
            {(activeBatches[batchIndex] ?? activeBatches[0] ?? []).map((s) => (
              <SuggestionCard key={s.id} suggestion={s} onUse={handleUseSuggestion} />
            ))}
          </div>
        </div>
        </div>{/* end left column */}

        {/* Right: Composer */}
        <div
          ref={composerRef}
          className="rounded-2xl p-5"
          style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Account switcher — only shown when multiple accounts are connected */}
          {accounts.length > 1 && (
            <div className="mb-4">
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                Post as
              </label>
              <div className="flex gap-2 flex-wrap">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccountId(account.id)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150"
                    style={
                      selectedAccountId === account.id
                        ? { background: "rgba(29,155,240,0.2)", border: "1px solid rgba(29,155,240,0.5)", color: "#1d9bf0" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#8e8e93" }
                    }
                  >
                    @{account.username}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {(() => {
            const selectedAccount = accounts.find(a => a.id === selectedAccountId);
            const displayName = selectedAccount?.displayName;
            const username = selectedAccount?.username;
            return mode === "single" ? (
              <SingleComposer
                text={singleText}
                onChange={setSingleText}
                onPost={handlePostSingle}
                posting={posting}
                avatarUrl={avatarUrl}
                displayName={displayName}
                username={username}
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
                avatarUrl={avatarUrl}
                displayName={displayName}
                username={username}
              />
            );
          })()}
        </div>
      </div>

      {toast && <Toast {...toast} />}
    </div>
  );
}
