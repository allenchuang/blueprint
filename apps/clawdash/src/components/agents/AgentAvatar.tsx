import { cn } from "@/lib/utils";

export type AgentId = "ash" | "ocean" | "skylar" | "coral" | "arctic";

export interface AgentConfig {
  id: AgentId;
  name: string;
  emoji: string;
  role: string;
  gradient: string;
  glowColor: string;
  ringColor: string;
}

export const AGENTS: Record<AgentId, AgentConfig> = {
  ash: {
    id: "ash",
    name: "Ash",
    emoji: "🔥",
    role: "Head of Operations",
    gradient: "from-orange-500 to-red-600",
    glowColor: "rgba(249,115,22,0.35)",
    ringColor: "ring-orange-500/30",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    role: "Head of Engineering",
    gradient: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6,182,212,0.35)",
    ringColor: "ring-cyan-500/30",
  },
  skylar: {
    id: "skylar",
    name: "Skylar",
    emoji: "⚡",
    role: "Head of Growth",
    gradient: "from-yellow-400 to-amber-500",
    glowColor: "rgba(234,179,8,0.35)",
    ringColor: "ring-yellow-400/30",
  },
  coral: {
    id: "coral",
    name: "Coral",
    emoji: "🪸",
    role: "Head of Design",
    gradient: "from-pink-500 to-rose-600",
    glowColor: "rgba(236,72,153,0.35)",
    ringColor: "ring-pink-500/30",
  },
  arctic: {
    id: "arctic",
    name: "Arctic",
    emoji: "🧊",
    role: "Head of Research",
    gradient: "from-blue-400 to-slate-500",
    glowColor: "rgba(96,165,250,0.35)",
    ringColor: "ring-blue-400/30",
  },
};

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<AvatarSize, { wrapper: string; emoji: string }> = {
  sm: { wrapper: "w-8 h-8 rounded-lg text-base", emoji: "text-sm" },
  md: { wrapper: "w-10 h-10 rounded-xl text-lg", emoji: "text-base" },
  lg: { wrapper: "w-14 h-14 rounded-2xl text-2xl", emoji: "text-xl" },
  xl: { wrapper: "w-20 h-20 rounded-3xl text-4xl", emoji: "text-3xl" },
};

interface AgentAvatarProps {
  agent: AgentId | AgentConfig;
  size?: AvatarSize;
  showGlow?: boolean;
  className?: string;
}

export function AgentAvatar({
  agent,
  size = "md",
  showGlow = false,
  className,
}: AgentAvatarProps) {
  const config = typeof agent === "string" ? AGENTS[agent] : agent;
  const sizes = SIZE_CLASSES[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-gradient-to-br shrink-0 ring-1",
        sizes.wrapper,
        config.gradient,
        config.ringColor,
        className
      )}
      style={
        showGlow
          ? { boxShadow: `0 0 16px 2px ${config.glowColor}` }
          : undefined
      }
    >
      <span className={cn("leading-none select-none", sizes.emoji)}>
        {config.emoji}
      </span>
    </div>
  );
}
