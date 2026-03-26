"use client";

import { useState } from "react";
import { leads } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PlatformBadge } from "./platform-badge";
import {
  X,
  TrendingUp,
  Users,
  Zap,
  Heart,
  MessageSquare,
  Repeat2,
  AtSign,
  Star,
} from "lucide-react";

interface LeadTrackerProps {
  onClose: () => void;
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-6 text-right">
        {score}
      </span>
    </div>
  );
}

function InteractionIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    like: <Heart className="w-3 h-3" />,
    comment: <MessageSquare className="w-3 h-3" />,
    share: <Repeat2 className="w-3 h-3" />,
    mention: <AtSign className="w-3 h-3" />,
  };
  return (
    <span className="text-muted-foreground">{icons[type] ?? <Zap className="w-3 h-3" />}</span>
  );
}

type SortKey = "totalScore" | "influenceScore" | "engagementScore" | "followers";

export function LeadTracker({ onClose }: LeadTrackerProps) {
  const [sortBy, setSortBy] = useState<SortKey>("totalScore");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...leads].sort((a, b) => b[sortBy] - a[sortBy]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Lead Tracker
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {leads.length} accounts repeatedly engaging — scored by influence &
            engagement
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/20">
        <span className="text-xs text-muted-foreground">Sort by:</span>
        {(
          [
            { key: "totalScore", label: "Total Score" },
            { key: "influenceScore", label: "Influence" },
            { key: "engagementScore", label: "Engagement" },
            { key: "followers", label: "Followers" },
          ] as Array<{ key: SortKey; label: string }>
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
              sortBy === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="divide-y divide-border">
        {sorted.map((lead, i) => (
          <div key={lead.id}>
            <button
              onClick={() =>
                setExpanded(expanded === lead.id ? null : lead.id)
              }
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
            >
              {/* Rank */}
              <span className="text-xs font-mono text-muted-foreground w-4 flex-shrink-0">
                {i + 1}
              </span>

              {/* Platform */}
              <PlatformBadge platform={lead.platform} size="sm" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {lead.handle}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lead.displayName}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-muted-foreground">
                    <Users className="w-3 h-3 inline mr-1" />
                    {formatNumber(lead.followers)} followers
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    <Zap className="w-3 h-3 inline mr-1" />
                    {lead.engagementCount} interactions
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Last: {timeAgo(lead.lastEngaged)}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="flex-shrink-0 w-48 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-14">
                    Influence
                  </span>
                  <ScoreBar score={lead.influenceScore} color="bg-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-14">
                    Engagement
                  </span>
                  <ScoreBar
                    score={lead.engagementScore}
                    color="bg-emerald-500"
                  />
                </div>
              </div>

              {/* Total Score */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-lg font-bold text-foreground">
                    {lead.totalScore}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  total score
                </span>
              </div>
            </button>

            {/* Expanded: Interactions */}
            {expanded === lead.id && (
              <div className="px-5 pb-4 bg-muted/10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Recent Interactions
                </p>
                <div className="space-y-1.5">
                  {lead.interactions.slice(0, 5).map((interaction, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <InteractionIcon type={interaction.type} />
                      <span className="capitalize font-medium">
                        {interaction.type}
                      </span>
                      <span>on post {interaction.postId}</span>
                      <span className="ml-auto">
                        {timeAgo(interaction.date)}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 flex items-center gap-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  <AtSign className="w-3.5 h-3.5" />
                  Draft outreach to {lead.handle}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
