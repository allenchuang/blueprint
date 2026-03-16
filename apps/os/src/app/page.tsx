"use client";

import { Desktop } from "@/components/desktop";
import { OpenClawControl } from "@/components/openclaw-control";
import { useTheme } from "@/contexts/theme-context";
import { getRegistryWindows, getRegistryIcons } from "@/lib/registry-config";
import type { DesktopConfig } from "@/types";

/* ==========================================================================
   APP WINDOW COMPONENTS (static, not from registry)
   ========================================================================== */

function TerminalDemo() {
  return (
    <div className="h-full bg-black text-green-400 font-mono p-4 overflow-auto">
      <div className="mb-4">
        <span className="text-zinc-500">
          Last login: {new Date().toLocaleString()}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex">
          <span className="text-blue-400">dev</span>
          <span className="text-white">@</span>
          <span className="text-purple-400">blueprint</span>
          <span className="text-white">:~$</span>
          <span className="ml-2">pnpm dev</span>
        </div>
        <div className="text-zinc-400">Starting all apps...</div>
        <div>
          <span className="text-cyan-400">web</span>
          <span className="text-zinc-500"> &rarr; </span>
          <span>http://localhost:3000</span>
        </div>
        <div>
          <span className="text-orange-400">server</span>
          <span className="text-zinc-500"> &rarr; </span>
          <span>http://localhost:3001</span>
        </div>
        <div>
          <span className="text-violet-400">admin</span>
          <span className="text-zinc-500"> &rarr; </span>
          <span>http://localhost:3002</span>
        </div>
        <div>
          <span className="text-emerald-400">docs</span>
          <span className="text-zinc-500"> &rarr; </span>
          <span>http://localhost:3003</span>
        </div>
        <div>
          <span className="text-pink-400">remotion</span>
          <span className="text-zinc-500"> &rarr; </span>
          <span>http://localhost:3004</span>
        </div>
        <div className="flex mt-2">
          <span className="text-blue-400">dev</span>
          <span className="text-white">@</span>
          <span className="text-purple-400">blueprint</span>
          <span className="text-white">:~$</span>
          <span className="ml-2 animate-pulse">&#9611;</span>
        </div>
      </div>
    </div>
  );
}

function NotesDemo() {
  return (
    <div className="h-full bg-amber-50 p-4">
      <h2 className="text-lg font-bold text-amber-800 mb-3">Quick Notes</h2>
      <textarea
        className="w-full h-[calc(100%-3rem)] bg-transparent resize-none focus:outline-none text-amber-900 placeholder:text-amber-400"
        placeholder="Start typing your notes..."
        defaultValue={`Blueprint Monorepo\n\nApps:\n- Web      → :3000\n- Server   → :3001\n- Admin    → :3002\n- Docs     → :3003\n- Remotion → :3004\n- OS       → :7777\n\nClick any desktop icon to open the app in a browser window.`}
      />
    </div>
  );
}

function SettingsDemo() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <div
      className="h-full p-6 overflow-auto transition-colors duration-200"
      style={{
        backgroundColor: colors.overlayBg,
        color: colors.textPrimary,
      }}
    >
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      <div className="space-y-6">
        <div
          className="rounded-lg p-4 transition-colors duration-200"
          style={{ backgroundColor: colors.titleBarBg }}
        >
          <h3 className="font-medium mb-3">Appearance</h3>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full text-left"
          >
            <span style={{ color: colors.textSecondary }}>Dark Mode</span>
            <div
              className="w-12 h-6 rounded-full relative transition-colors duration-200"
              style={{
                backgroundColor: isDark ? "#3b82f6" : colors.border,
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200"
                style={{
                  left: isDark ? "calc(100% - 1.25rem)" : "0.25rem",
                }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STATIC APP ICONS (for Terminal, Notes, Settings)
   ========================================================================== */

const TerminalIcon = () => (
  <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700 shadow-lg">
    <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  </div>
);

const NotesIcon = () => (
  <div className="w-14 h-14 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
    <svg className="w-8 h-8 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  </div>
);

const SettingsIcon = () => (
  <div className="w-14 h-14 bg-zinc-700 rounded-xl flex items-center justify-center border border-zinc-600 shadow-lg">
    <svg className="w-8 h-8 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  </div>
);

const TerminalTitleIcon = () => (
  <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const NotesTitleIcon = () => (
  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const SettingsTitleIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const OpenClawIcon = () => (
  <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M10 5v-2M14 5v-2M14 3h-4" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      <path d="M9 15h6" strokeLinecap="round" />
    </svg>
  </div>
);

const OpenClawTitleIcon = () => (
  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="5" width="16" height="12" rx="2" />
    <path d="M10 5v-2M14 5v-2M14 3h-4" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1" />
    <circle cx="15" cy="10" r="1" />
    <path d="M9 15h6" strokeLinecap="round" />
  </svg>
);

/* ==========================================================================
   DESKTOP CONFIG (registry-driven browser windows + static app windows)
   ========================================================================== */

const desktopConfig: DesktopConfig = {
  windows: [
    ...getRegistryWindows(),
    {
      id: "terminal",
      type: "app",
      title: "Terminal",
      icon: <TerminalTitleIcon />,
      component: TerminalDemo,
      dimensions: { responsive: false, width: "650px", height: "450px" },
    },
    {
      id: "notes",
      type: "app",
      title: "Notes",
      icon: <NotesTitleIcon />,
      component: NotesDemo,
      dimensions: { responsive: false, width: "380px", height: "480px" },
    },
    {
      id: "settings",
      type: "app",
      title: "Settings",
      icon: <SettingsTitleIcon />,
      component: SettingsDemo,
      dimensions: { responsive: false, width: "450px", height: "400px" },
    },
    {
      id: "openclaw",
      type: "app",
      title: "OpenClaw",
      icon: <OpenClawTitleIcon />,
      component: OpenClawControl,
      dimensions: { responsive: false, width: "480px", height: "520px" },
    },
  ],
  icons: [
    ...getRegistryIcons(),
    { id: "terminal-icon", windowId: "terminal", icon: <TerminalIcon />, label: "Terminal" },
    { id: "notes-icon", windowId: "notes", icon: <NotesIcon />, label: "Notes" },
    { id: "settings-icon", windowId: "settings", icon: <SettingsIcon />, label: "Settings" },
    { id: "openclaw-icon", windowId: "openclaw", icon: <OpenClawIcon />, label: "OpenClaw" },
  ],
  darkBackground: {
    type: "image",
    url: "https://images.pexels.com/photos/34720596/pexels-photo-34720596.jpeg?auto=compress&cs=tinysrgb&w=1920",
    size: "cover",
    position: "center",
  },
  lightBackground: {
    type: "image",
    url: "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=1920",
    size: "cover",
    position: "center",
  },
  iconLayout: {
    startPosition: "top-left",
    direction: "vertical",
    gap: 8,
    padding: 16,
  },
  autoOpenWindow: "web",
};

export default function OsPage() {
  return <Desktop config={desktopConfig} />;
}
