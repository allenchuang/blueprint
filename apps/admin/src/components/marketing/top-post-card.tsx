import { Heart, MessageSquare, Repeat2, Eye } from "lucide-react";
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
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:border-border/80 transition-colors">
      <div className="flex items-center justify-between">
        <PlatformBadge platform={post.platform} showLabel />
        <span className="text-[11px] text-muted-foreground">
          {timeAgo(post.publishedAt)}
        </span>
      </div>

      <p className="text-sm text-foreground leading-relaxed line-clamp-3">
        {post.content}
      </p>

      <div className="pt-1 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(post.likes)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="w-3.5 h-3.5" />
              {formatNumber(post.comments)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Repeat2 className="w-3.5 h-3.5" />
              {formatNumber(post.shares)}
            </div>
          </div>
          <span className="text-xs font-semibold text-primary">
            {post.engagementRate}% eng.
          </span>
        </div>
      </div>
    </div>
  );
}
