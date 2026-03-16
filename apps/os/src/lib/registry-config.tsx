import type { ReactNode } from "react";
import { appsRegistry, type AppEntry } from "@repo/app-config";
import type { WindowConfig, DesktopIconConfig } from "@/types";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN;
const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST;

const SVG_PATHS: Record<string, { desktop: ReactNode; titleBar: ReactNode }> = {
  globe: {
    desktop: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    titleBar: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
  server: {
    desktop: (
      <>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </>
    ),
    titleBar: (
      <>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </>
    ),
  },
  shield: {
    desktop: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    titleBar: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  book: {
    desktop: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </>
    ),
    titleBar: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  video: {
    desktop: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
    titleBar: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
  },
  monitor: {
    desktop: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
    titleBar: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
  },
};

const DEFAULT_COLORS = { from: "from-zinc-600", to: "to-zinc-800", text: "text-zinc-400" } as const;

const COLOR_MAP: Record<string, { from: string; to: string; text: string }> = {
  cyan: { from: "from-cyan-500", to: "to-blue-600", text: "text-cyan-400" },
  orange: { from: "from-orange-500", to: "to-red-600", text: "text-orange-400" },
  violet: { from: "from-violet-500", to: "to-purple-700", text: "text-violet-400" },
  emerald: { from: "from-emerald-500", to: "to-teal-600", text: "text-emerald-400" },
  pink: { from: "from-pink-500", to: "to-rose-600", text: "text-pink-400" },
  zinc: DEFAULT_COLORS,
};

function getAppUrl(app: AppEntry): string {
  const suffix = app.id === "server" ? "/docs" : "";
  if (BASE_DOMAIN) {
    return `https://${app.subdomain}.${BASE_DOMAIN}${suffix}`;
  }
  if (APP_HOST) {
    return `http://${APP_HOST}:${app.port}${suffix}`;
  }
  return `http://localhost:${app.port}${suffix}`;
}

function DesktopAppIcon({ app }: { app: AppEntry }) {
  const paths = SVG_PATHS[app.icon];
  const colors = COLOR_MAP[app.color] ?? DEFAULT_COLORS;
  if (!paths) return null;
  return (
    <div className={`w-14 h-14 bg-linear-to-br ${colors.from} ${colors.to} rounded-xl flex items-center justify-center shadow-lg`}>
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {paths.desktop}
      </svg>
    </div>
  );
}

function TitleBarIcon({ app }: { app: AppEntry }) {
  const paths = SVG_PATHS[app.icon];
  const colors = COLOR_MAP[app.color] ?? DEFAULT_COLORS;
  if (!paths) return null;
  return (
    <svg className={`w-4 h-4 ${colors.text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {paths.titleBar}
    </svg>
  );
}

export function getRegistryWindows(): WindowConfig[] {
  return appsRegistry
    .filter((app) => app.id !== "os")
    .map((app) => ({
      id: app.id,
      type: "browser" as const,
      title: getAppUrl(app),
      icon: <TitleBarIcon app={app} />,
      url: getAppUrl(app),
      showReloadButton: true,
      openMaximized: app.openMaximized ?? true,
      ...(app.id === "server"
        ? { dimensions: { responsive: false as const, width: "1000px", height: "700px" } }
        : {}),
    }));
}

export function getRegistryIcons(): DesktopIconConfig[] {
  return appsRegistry
    .filter((app) => app.id !== "os")
    .map((app) => ({
      id: `${app.id}-icon`,
      windowId: app.id,
      icon: <DesktopAppIcon app={app} />,
      label: app.name,
    }));
}
