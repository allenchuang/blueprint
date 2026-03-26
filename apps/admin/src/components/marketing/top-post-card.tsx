import { Heart, MessageSquare, Repeat2, Eye } from "lucide-react";
import { PlatformBadge } from "./platform-badge";
import type { TwitterTweet } from "@/app/api/twitter/tweets/route";

interface TopPostCardProps {
  tweet: TwitterTweet;
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function TopPostCard({ tweet }: TopPostCardProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor(diff / 3_600_000);
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  const { likeCount, retweetCount, replyCount, impressionCount } = tweet.publicMetrics;
  const engagements = likeCount + retweetCount + replyCount;
  const er =
    impressionCount > 0
      ? Math.round((engagements / impressionCount) * 10_000) / 100
      : 0;

  return (
    <div
      className="mac-card p-4 space-y-3 transition-all duration-150 hover:brightness-110"
      style={{ background: "#2c2c2e", cursor: "default" }}
    >
      <div className="flex items-center justify-between">
        <PlatformBadge platform="twitter" showLabel />
        <span className="text-[11px]" style={{ color: "#636366" }}>
          {tweet.createdAt ? timeAgo(tweet.createdAt) : ""}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: "#e5e5ea" }}>
        {tweet.text}
      </p>

      <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(likeCount)}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <MessageSquare className="w-3.5 h-3.5" />
              {formatNumber(replyCount)}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <Repeat2 className="w-3.5 h-3.5" />
              {formatNumber(retweetCount)}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(impressionCount)}
            </div>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: "#0a84ff" }}>
            {er}% eng.
          </span>
        </div>
      </div>
    </div>
  );
}
