"use client";

import { useState } from "react";
import { leads } from "@/lib/mock-data";
import { PlatformBadge } from "./platform-badge";
import { X, Users, Zap, Heart, MessageSquare, Repeat2, AtSign, Star } from "lucide-react";

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
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-mono w-6 text-right" style={{ color: "#636366" }}>
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
  return <span style={{ color: "#636366" }}>{icons[type] ?? <Zap className="w-3 h-3" />}</span>;
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
    <div
      className="mac-card overflow-hidden"
      style={{ background: "#2c2c2e" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h3 className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
            Lead Tracker
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "#636366" }}>
            {leads.length} accounts repeatedly engaging — scored by influence & engagement
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ color: "#636366" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f5f7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#636366")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sort controls */}
      <div
        className="flex items-center gap-2 px-5 py-3 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
      >
        <span className="text-[12px] flex-shrink-0" style={{ color: "#636366" }}>Sort:</span>
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
            className="px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors flex-shrink-0 min-h-[28px]"
            style={
              sortBy === key
                ? { background: "#0a84ff", color: "#fff" }
                : { color: "#8e8e93" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div>
        {sorted.map((lead, i) => (
          <div key={lead.id}>
            <button
              onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
              className="w-full flex items-center gap-3 md:gap-4 px-5 py-3.5 text-left transition-colors min-h-[60px]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span className="text-[12px] font-mono w-4 flex-shrink-0" style={{ color: "#636366" }}>
                {i + 1}
              </span>
              <PlatformBadge platform={lead.platform} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: "#f5f5f7" }}>
                    {lead.handle}
                  </span>
                  <span className="text-[11px] hidden sm:inline" style={{ color: "#636366" }}>
                    {lead.displayName}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px]" style={{ color: "#636366" }}>
                    <Users className="w-3 h-3 inline mr-1" />
                    {formatNumber(lead.followers)}
                  </span>
                  <span className="text-[11px] hidden sm:inline" style={{ color: "#636366" }}>
                    <Zap className="w-3 h-3 inline mr-1" />
                    {lead.engagementCount}x
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 w-36 space-y-1 hidden md:block">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-14" style={{ color: "#636366" }}>Influence</span>
                  <ScoreBar score={lead.influenceScore} color="#0a84ff" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-14" style={{ color: "#636366" }}>Engage</span>
                  <ScoreBar score={lead.engagementScore} color="#30d158" />
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-3 h-3" style={{ color: "#ff9f0a" }} />
                  <span className="text-[16px] font-bold" style={{ color: "#f5f5f7" }}>
                    {lead.totalScore}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: "#636366" }}>score</span>
              </div>
            </button>

            {expanded === lead.id && (
              <div
                className="px-5 pb-4 pt-2"
                style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#636366" }}>
                  Recent Interactions
                </p>
                <div className="space-y-1.5">
                  {lead.interactions.slice(0, 5).map((interaction, j) => (
                    <div key={j} className="flex items-center gap-2 text-[12px]" style={{ color: "#8e8e93" }}>
                      <InteractionIcon type={interaction.type} />
                      <span className="capitalize font-medium">{interaction.type}</span>
                      <span>on post {interaction.postId}</span>
                      <span className="ml-auto" style={{ color: "#636366" }}>{timeAgo(interaction.date)}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 flex items-center gap-2 text-[12px] font-medium transition-colors"
                  style={{ color: "#0a84ff" }}
                >
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
