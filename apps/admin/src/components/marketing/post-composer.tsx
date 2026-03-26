"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlatformPill } from "./platform-badge";
import type { Platform } from "@/lib/mock-data";
import {
  X,
  Calendar,
  Send,
  Eye,
  Image,
  Link,
  Hash,
  CheckCircle2,
  Clock,
} from "lucide-react";

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    "twitter",
  ]);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>("twitter");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [posted, setPosted] = useState(false);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handlePost = () => {
    // Mock post action
    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      onClose();
    }, 2000);
  };

  const charCount = content.length;
  const limit = PLATFORM_LIMITS[previewPlatform];
  const overLimit = charCount > limit;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Compose Post
        </h3>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {posted ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <p className="text-sm font-medium text-foreground">
            {isScheduled ? "Post scheduled!" : "Posted successfully!"}
          </p>
          <p className="text-xs text-muted-foreground">
            Closing composer...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left: Editor */}
          <div className="p-5 space-y-4">
            {/* Platform selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Post to
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["twitter", "instagram", "tiktok"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={cn(
                      "transition-all rounded-lg border px-3 py-1.5 text-xs font-medium",
                      selectedPlatforms.includes(p)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <PlatformPill platform={p} />
                  </button>
                ))}
              </div>
            </div>

            {/* Content textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening at Blueprint OS? Share a build update, insight, or milestone..."
                className="w-full h-40 bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <button className="hover:text-foreground transition-colors">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="hover:text-foreground transition-colors">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="hover:text-foreground transition-colors">
                    <Hash className="w-4 h-4" />
                  </button>
                </div>
                <span
                  className={cn(
                    "text-xs",
                    overLimit ? "text-red-500 font-semibold" : "text-muted-foreground"
                  )}
                >
                  {charCount}/{limit}
                </span>
              </div>
            </div>

            {/* Schedule toggle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    isScheduled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                      isScheduled ? "translate-x-4" : "translate-x-1"
                    )}
                  />
                </button>
                <span className="text-xs font-medium text-foreground">
                  Schedule for later
                </span>
              </div>
              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handlePost}
                disabled={!content.trim() || selectedPlatforms.length === 0 || overLimit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isScheduled ? (
                  <>
                    <Clock className="w-4 h-4" />
                    Schedule
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="p-5 space-y-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preview
              </label>
              <div className="flex gap-1">
                {selectedPlatforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className={cn(
                      "px-2 py-1 rounded text-[11px] font-medium transition-colors",
                      previewPlatform === p
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p === "twitter" ? "X" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform preview mockup */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  BP
                </div>
                <div>
                  <p className="text-xs font-semibold">Blueprint OS</p>
                  <p className="text-[11px] text-muted-foreground">
                    @blueprintos
                    {previewPlatform === "twitter" && " · Just now"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {content || (
                  <span className="text-muted-foreground italic">
                    Your post will appear here...
                  </span>
                )}
              </p>
              {content && previewPlatform === "twitter" && (
                <div className="flex items-center gap-5 text-muted-foreground text-xs pt-1">
                  <span>💬 Reply</span>
                  <span>🔁 Repost</span>
                  <span>❤️ Like</span>
                  <span>📤 Share</span>
                </div>
              )}
              {content && previewPlatform === "instagram" && (
                <div className="flex items-center gap-4 text-muted-foreground text-sm pt-1">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
              )}
            </div>

            {/* Platform tips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tips for {previewPlatform === "twitter" ? "Twitter/X" : previewPlatform}
              </p>
              <ul className="space-y-1">
                {PLATFORM_TIPS[previewPlatform].map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
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
