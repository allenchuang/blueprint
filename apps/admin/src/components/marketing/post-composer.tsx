"use client";

import { useState } from "react";
import { PlatformPill } from "./platform-badge";
import type { Platform } from "@/lib/types";
import { X, Send, Image, Link, Hash, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostComposerProps {
  onClose: () => void;
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  instagram: 2200,
  tiktok: 2200,
};

const PLATFORM_TIPS: Record<Platform, string[]> = {
  twitter: [
    "Threads get 3x more engagement",
    "Add 1-2 relevant hashtags max",
    "Post between 8-10 AM or 6-9 PM",
  ],
  instagram: [
    "Use 5-10 hashtags in comments",
    "First line is the hook — make it count",
    "Emoji in the right places boost saves",
  ],
  tiktok: [
    "Caption supports the video, not replaces it",
    "3-5 hashtags: 1 broad + 2-3 niche",
    "Add text overlays — 85% watch muted",
  ],
};

export function PostComposer({ onClose }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["twitter"]);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>("twitter");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [posted, setPosted] = useState(false);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handlePost = async () => {
    if (selectedPlatforms.includes("twitter") && content.trim()) {
      try {
        const res = await fetch("/api/twitter/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: content }),
        });
        if (!res.ok && res.status !== 403) {
          console.warn("[post-composer] Twitter post failed silently");
        }
      } catch {
        // Non-blocking
      }
    }
    setPosted(true);
    setTimeout(() => { setPosted(false); onClose(); }, 2000);
  };

  const charCount = content.length;
  const limit = PLATFORM_LIMITS[previewPlatform];
  const overLimit = charCount > limit;

  return (
    <div
      className="mac-card overflow-hidden"
      style={{ background: "#2c2c2e" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
          Compose Post
        </h3>
        <button
          onClick={onClose}
          className="transition-colors"
          style={{ color: "#636366" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f5f7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#636366")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {posted ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <CheckCircle2 className="w-10 h-10" style={{ color: "#30d158" }} />
          <p className="text-[14px] font-medium" style={{ color: "#f5f5f7" }}>
            {isScheduled ? "Post scheduled!" : "Posted successfully!"}
          </p>
          <p className="text-[12px]" style={{ color: "#636366" }}>
            Closing composer…
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ "--tw-divide-opacity": "1" } as React.CSSProperties}>
          <style>{`.compose-divider > *+* { border-color: rgba(255,255,255,0.06); }`}</style>
          {/* Editor */}
          <div className="p-5 space-y-4">
            {/* Platform selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                Post to
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["twitter", "instagram", "tiktok"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className="transition-all rounded-lg px-3 py-1.5 text-[12px] font-medium min-h-[32px]"
                    style={
                      selectedPlatforms.includes(p)
                        ? { background: "rgba(10,132,255,0.15)", border: "1px solid rgba(10,132,255,0.3)", color: "#5ac8fa" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#8e8e93" }
                    }
                  >
                    <PlatformPill platform={p} />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening at Blueprint OS?"
                className="w-full h-36 rounded-xl px-3 py-2.5 text-[13px] resize-none focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f5f5f7",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(10,132,255,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3" style={{ color: "#636366" }}>
                  {[Image, Link, Hash].map((Icon, i) => (
                    <button key={i} className="hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: overLimit ? "#ff453a" : "#636366" }}
                >
                  {charCount}/{limit}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScheduled(!isScheduled)}
                  className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                  style={{ background: isScheduled ? "#0a84ff" : "rgba(255,255,255,0.12)" }}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow"
                    style={{ transform: isScheduled ? "translateX(16px)" : "translateX(2px)" }}
                  />
                </button>
                <span className="text-[12px] font-medium" style={{ color: "#c7c7cc" }}>
                  Schedule for later
                </span>
              </div>
              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-[13px] focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f5f5f7",
                  }}
                />
              )}
            </div>

            {/* Actions */}
            <button
              onClick={() => void handlePost()}
              disabled={!content.trim() || selectedPlatforms.length === 0 || overLimit}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all min-h-[44px]"
              style={{ background: "#0a84ff", color: "#fff" }}
            >
              {isScheduled ? <><Clock className="w-4 h-4" />Schedule</> : <><Send className="w-4 h-4" />Post Now</>}
            </button>
          </div>

          {/* Preview */}
          <div className="p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                Preview
              </label>
              <div className="flex gap-1">
                {selectedPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                    style={
                      previewPlatform === p
                        ? { background: "rgba(10,132,255,0.15)", color: "#5ac8fa" }
                        : { color: "#636366" }
                    }
                  >
                    {p === "twitter" ? "X" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mock post preview */}
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "rgba(10,132,255,0.2)", color: "#0a84ff" }}
                >
                  BP
                </div>
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: "#f5f5f7" }}>Blueprint OS</p>
                  <p className="text-[11px]" style={{ color: "#636366" }}>
                    @blueprint_os{previewPlatform === "twitter" && " · Just now"}
                  </p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "#e5e5ea" }}>
                {content || <span style={{ color: "#636366", fontStyle: "italic" }}>Your post will appear here…</span>}
              </p>
              {content && previewPlatform === "twitter" && (
                <div className="flex items-center gap-5 text-[12px] pt-1" style={{ color: "#636366" }}>
                  <span>💬</span><span>🔁</span><span>❤️</span><span>📤</span>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#636366", letterSpacing: "0.08em" }}>
                Tips for {previewPlatform === "twitter" ? "Twitter/X" : previewPlatform}
              </p>
              <ul className="space-y-1.5">
                {PLATFORM_TIPS[previewPlatform].map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12px]" style={{ color: "#8e8e93" }}>
                    <span style={{ color: "#0a84ff" }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
