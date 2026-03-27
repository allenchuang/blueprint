"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  windowBg: string;
  windowBgBlurred: string;
  titleBarBg: string;
  titleBarBgInactive: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  urlBarBg: string;
  hoverBg: string;
  overlayBg: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const darkTheme: ThemeColors = {
  windowBg: "rgba(0, 0, 0, 0.7)",
  windowBgBlurred: "rgba(0, 0, 0, 0.5)",
  titleBarBg: "rgb(39, 39, 42)",
  titleBarBgInactive: "rgb(58, 58, 64)",
  border: "rgb(63, 63, 70)",
  textPrimary: "rgb(255, 255, 255)",
  textSecondary: "rgb(161, 161, 170)",
  urlBarBg: "rgba(24, 24, 27, 0.8)",
  hoverBg: "rgb(63, 63, 70)",
  overlayBg: "rgb(24, 24, 27)",
};

export const lightTheme: ThemeColors = {
  windowBg: "rgba(255, 255, 255, 0.9)",
  windowBgBlurred: "rgba(255, 255, 255, 0.7)",
  titleBarBg: "rgb(244, 244, 245)",
  titleBarBgInactive: "rgb(228, 228, 231)",
  border: "rgb(212, 212, 216)",
  textPrimary: "rgb(24, 24, 27)",
  textSecondary: "rgb(113, 113, 122)",
  urlBarBg: "rgba(244, 244, 245, 0.8)",
  hoverBg: "rgb(228, 228, 231)",
  overlayBg: "rgb(250, 250, 250)",
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultTheme);

  const colors = mode === "dark" ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--desktop-window-bg", colors.windowBg);
    root.style.setProperty(
      "--desktop-window-bg-blurred",
      colors.windowBgBlurred
    );
    root.style.setProperty("--desktop-titlebar-bg", colors.titleBarBg);
    root.style.setProperty(
      "--desktop-titlebar-bg-inactive",
      colors.titleBarBgInactive
    );
    root.style.setProperty("--desktop-border", colors.border);
    root.style.setProperty("--desktop-text-primary", colors.textPrimary);
    root.style.setProperty(
      "--desktop-text-secondary",
      colors.textSecondary
    );
    root.style.setProperty("--desktop-urlbar-bg", colors.urlBarBg);
    root.style.setProperty("--desktop-hover-bg", colors.hoverBg);
    root.style.setProperty("--desktop-overlay-bg", colors.overlayBg);
    root.setAttribute("data-desktop-theme", mode);
  }, [colors, mode]);

  const value: ThemeContextValue = useMemo(
    () => ({
      mode,
      colors,
      toggleTheme,
      setTheme,
      isDark: mode === "dark",
    }),
    [mode, colors, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
