import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/mock-data";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const platformConfig = {
  twitter: {
    label: "Twitter / X",
    bg: "bg-sky-500/10",
    text: "text-sky-500",
    emoji: "𝕏",
  },
  instagram: {
    label: "Instagram",
    bg: "bg-pink-500/10",
    text: "text-pink-500",
    emoji: "IG",
  },
  tiktok: {
    label: "TikTok",
    bg: "bg-red-500/10",
    text: "text-red-500",
    emoji: "TT",
  },
};

export function PlatformBadge({
  platform,
  size = "sm",
  showLabel = false,
}: PlatformBadgeProps) {
  const config = platformConfig[platform];

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "rounded-md flex items-center justify-center font-bold",
          config.bg,
          config.text,
          size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs"
        )}
      >
        {config.emoji}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-foreground">
          {config.label}
        </span>
      )}
    </div>
  );
}

export function PlatformPill({ platform }: { platform: Platform }) {
  const config = platformConfig[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
        config.bg,
        config.text
      )}
    >
      {config.emoji} {config.label}
    </span>
  );
}
