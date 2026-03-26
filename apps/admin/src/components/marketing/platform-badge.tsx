import type { Platform } from "@/lib/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const platformConfig = {
  twitter: {
    label: "Twitter / X",
    bg: "rgba(10,132,255,0.12)",
    color: "#0a84ff",
    emoji: "𝕏",
  },
  instagram: {
    label: "Instagram",
    bg: "rgba(191,90,242,0.12)",
    color: "#bf5af2",
    emoji: "IG",
  },
  tiktok: {
    label: "TikTok",
    bg: "rgba(255,55,95,0.12)",
    color: "#ff375f",
    emoji: "TT",
  },
};

export function PlatformBadge({
  platform,
  size = "sm",
  showLabel = false,
}: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const dim = size === "sm" ? 24 : 32;
  const fontSize = size === "sm" ? 10 : 12;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-lg flex items-center justify-center font-bold flex-shrink-0"
        style={{
          width: dim,
          height: dim,
          background: config.bg,
          color: config.color,
          fontSize,
        }}
      >
        {config.emoji}
      </div>
      {showLabel && (
        <span className="text-[12px] font-medium" style={{ color: "#e5e5ea" }}>
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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.emoji} {config.label}
    </span>
  );
}
