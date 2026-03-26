import { Heart, MessageSquare, Repeat2 } from "lucide-react";
import { PlatformBadge } from "./platform-badge";
import type { Post } from "@/lib/mock-data";

interface TopPostCardProps {
  post: Post;
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function TopPostCard({ post }: TopPostCardProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  return (
    <div
      className="mac-card p-4 space-y-3 transition-all duration-150 hover:brightness-110"
      style={{ background: "#2c2c2e", cursor: "default" }}
    >
      <div className="flex items-center justify-between">
        <PlatformBadge platform={post.platform} showLabel />
        <span className="text-[11px]" style={{ color: "#636366" }}>
          {timeAgo(post.publishedAt)}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed line-clamp-3" style={{ color: "#e5e5ea" }}>
        {post.content}
      </p>

      <div
        className="pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(post.likes)}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <MessageSquare className="w-3.5 h-3.5" />
              {formatNumber(post.comments)}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: "#636366" }}>
              <Repeat2 className="w-3.5 h-3.5" />
              {formatNumber(post.shares)}
            </div>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: "#0a84ff" }}>
            {post.engagementRate}% eng.
          </span>
        </div>
      </div>
    </div>
  );
}
