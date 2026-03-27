export interface AppEntry {
  id: string;
  name: string;
  port: number;
  description: string;
  icon: string;
  color: string;
  subdomain: string;
  openMaximized?: boolean;
  /** "public" apps are exposed via Caddy; "private" are Tailscale-only */
  access: "public" | "private";
  /** Whether this is a Next.js app managed by PM2 */
  type: "nextjs" | "fastify" | "mintlify" | "remotion" | "expo" | "standalone";
}

export const appsRegistry: AppEntry[] = [
  {
    id: "web",
    name: "Web",
    port: 3000,
    description: "Main web application",
    icon: "globe",
    color: "cyan",
    subdomain: "app",
    openMaximized: true,
    access: "public",
    type: "nextjs",
  },
  {
    id: "server",
    name: "API Server",
    port: 3001,
    description: "Fastify REST API with Swagger docs",
    icon: "server",
    color: "orange",
    subdomain: "api",
    openMaximized: false,
    access: "public",
    type: "fastify",
  },
  {
    id: "admin",
    name: "Admin",
    port: 3002,
    description: "Admin panel",
    icon: "shield",
    color: "violet",
    subdomain: "admin",
    openMaximized: true,
    access: "private",
    type: "nextjs",
  },
  {
    id: "docs",
    name: "Docs",
    port: 3003,
    description: "Mintlify documentation",
    icon: "book",
    color: "emerald",
    subdomain: "docs",
    openMaximized: true,
    access: "public",
    type: "mintlify",
  },
  {
    id: "remotion",
    name: "Remotion",
    port: 3004,
    description: "Video generation studio",
    icon: "video",
    color: "pink",
    subdomain: "video",
    openMaximized: true,
    access: "private",
    type: "remotion",
  },
  {
    id: "clawdash",
    name: "ClawDash",
    port: 7778,
    description: "OpenClaw diagnostics and agent dashboard",
    icon: "activity",
    color: "amber",
    subdomain: "clawdash",
    openMaximized: true,
    access: "private",
    type: "nextjs",
  },
  {
    id: "os",
    name: "OS",
    port: 7777,
    description: "Desktop environment and command center",
    icon: "monitor",
    color: "zinc",
    subdomain: "os",
    openMaximized: true,
    access: "private",
    type: "nextjs",
  },
  {
    id: "paperclip",
    name: "Paperclip",
    port: 3100,
    description: "AI agent orchestration — plan, review, and coordinate AI coding agents",
    icon: "paperclip",
    color: "indigo",
    subdomain: "paperclip",
    openMaximized: true,
    access: "private",
    type: "standalone",
  },
];
