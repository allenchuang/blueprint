"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type RefObject,
} from "react";
import type {
  DesktopConfig,
  DesktopContextValue,
  DesktopIconConfig,
} from "@/types";
import { validateDesktopConfig, isWindowOpen, isWindowMinimized } from "@/types";
import { DesktopProvider } from "@/contexts/desktop-context";
import {
  ThemeProvider,
  type ThemeMode,
  useThemeOptional,
} from "@/contexts/theme-context";
import { useWindowManager } from "@/hooks/use-window-manager";
import { DesktopIcon, type DesktopIconRef } from "@/components/desktop-icon";
import { Window } from "@/components/window";

export interface DesktopProps {
  config: DesktopConfig;
  children?: React.ReactNode;
  className?: string;
  defaultTheme?: ThemeMode;
}

export function Desktop({
  config,
  children,
  className = "",
  defaultTheme = "dark",
}: DesktopProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <DesktopInner config={config} className={className}>
        {children}
      </DesktopInner>
    </ThemeProvider>
  );
}

function DesktopInner({
  config,
  children,
  className = "",
}: Omit<DesktopProps, "defaultTheme">) {
  const theme = useThemeOptional();
  const isDark = theme?.isDark ?? true;

  useEffect(() => {
    const result = validateDesktopConfig(config);
    if (!result.valid) {
      console.error("Desktop: Invalid configuration", result.errors);
    }
    if (result.warnings.length > 0) {
      console.warn("Desktop: Configuration warnings", result.warnings);
    }
  }, [config]);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const [showIcons, setShowIcons] = useState(false);

  const iconRefs = useRef<Map<string, RefObject<DesktopIconRef>>>(new Map());
  const cascadeCounter = useRef(0);
  const windowManager = useWindowManager(config.windows);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getIconRef = useCallback((iconId: string) => {
    return iconRefs.current.get(iconId) ?? null;
  }, []);

  const registerIconRef = useCallback(
    (iconId: string, ref: RefObject<DesktopIconRef>) => {
      iconRefs.current.set(iconId, ref as RefObject<DesktopIconRef>);
    },
    []
  );

  const getNextCascadeIndex = useCallback(() => {
    return cascadeCounter.current++;
  }, []);

  const handleIconClick = useCallback(
    (windowId: string) => {
      const instance = windowManager.windows.get(windowId);
      if (!instance) return;

      const state = instance.state;

      if (isWindowOpen(state)) {
        windowManager.focusWindow(windowId);
      } else if (isWindowMinimized(state)) {
        windowManager.restoreWindow(windowId);
      } else {
        windowManager.openWindow(windowId);
      }
    },
    [windowManager]
  );

  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (config.autoOpenWindow && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      const timer = setTimeout(() => {
        windowManager.openWindow(config.autoOpenWindow!);
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowIcons(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    windowManager.deactivateAll();
  }, [windowManager]);

  const contextValue: DesktopContextValue = useMemo(
    () => ({
      ...windowManager,
      getIconRef: getIconRef as (
        iconId: string
      ) => RefObject<HTMLDivElement> | null,
      registerIconRef: registerIconRef as (
        iconId: string,
        ref: RefObject<HTMLDivElement>
      ) => void,
      isMobile,
      getNextCascadeIndex,
    }),
    [windowManager, getIconRef, registerIconRef, isMobile, getNextCascadeIndex]
  );

  const iconLayout = config.iconLayout ?? {
    startPosition: "top-left" as const,
    direction: "vertical" as const,
    gap: 16,
    padding: 16,
  };

  const getIconContainerStyle = () => {
    const style: React.CSSProperties = {
      position: "absolute",
      display: "flex",
      gap: `${iconLayout.gap}px`,
      padding: `${iconLayout.padding}px`,
      zIndex: 10,
      transition: "transform 0.5s ease-out",
      transform: showIcons ? "translateX(0)" : "translateX(-300px)",
    };

    switch (iconLayout.startPosition) {
      case "top-left":
        style.top = 40;
        style.left = 0;
        break;
      case "top-right":
        style.top = 40;
        style.right = 0;
        break;
      case "bottom-left":
        style.bottom = 40;
        style.left = 0;
        break;
      case "bottom-right":
        style.bottom = 40;
        style.right = 0;
        break;
    }

    style.flexDirection =
      iconLayout.direction === "vertical" ? "column" : "row";

    return style;
  };

  const getBackgroundStyle = (bg: typeof config.background) => {
    if (!bg) return {};

    const style: React.CSSProperties = {};

    switch (bg.type) {
      case "color":
        style.backgroundColor = bg.color;
        break;
      case "image":
        style.backgroundImage = `url(${bg.url})`;
        style.backgroundSize = bg.size ?? "cover";
        style.backgroundPosition = bg.position ?? "center";
        break;
      case "gradient":
        style.background = bg.gradient;
        break;
    }

    return style;
  };

  const renderBackground = () => {
    const darkBg = config.darkBackground ?? config.background;
    const lightBg = config.lightBackground ?? config.background;

    const defaultDarkStyle = {
      background: "linear-gradient(to bottom, #18181b, #27272a)",
    };
    const defaultLightStyle = {
      background: "linear-gradient(to bottom, #f4f4f5, #e4e4e7)",
    };

    const darkStyle = darkBg
      ? getBackgroundStyle(darkBg)
      : defaultDarkStyle;
    const lightStyle = lightBg
      ? getBackgroundStyle(lightBg)
      : defaultLightStyle;

    return (
      <>
        <div className="absolute inset-0" style={lightStyle} />
        {lightBg?.overlay && (
          <div
            className="absolute inset-0"
            style={{ background: lightBg.overlay }}
          />
        )}

        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{
            ...darkStyle,
            opacity: isDark ? 1 : 0,
          }}
        />
        {darkBg?.overlay && (
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{
              background: darkBg.overlay,
              opacity: isDark ? 1 : 0,
            }}
          />
        )}
      </>
    );
  };

  return (
    <DesktopProvider value={contextValue}>
      <div className={`fixed inset-0 overflow-hidden ${className}`}>
        {renderBackground()}

        <div
          className="absolute inset-0 z-0"
          onClick={handleBackgroundClick}
        />

        <div style={getIconContainerStyle()}>
          {config.icons.map((iconConfig) => (
            <DesktopIconWrapper
              key={iconConfig.id}
              config={iconConfig}
              onClick={() => handleIconClick(iconConfig.windowId)}
              onRegisterRef={registerIconRef}
              isMobile={isMobile}
            />
          ))}
        </div>

        {Array.from(windowManager.windows.values()).map((instance) => {
          const iconConfig = config.icons.find(
            (i) => i.windowId === instance.config.id
          );
          const iconRef = iconConfig
            ? iconRefs.current.get(iconConfig.id)
            : undefined;

          const getIconPosition = iconRef?.current
            ? () => iconRef.current!.getPosition()
            : undefined;

          return (
            <Window
              key={instance.config.id}
              config={instance.config}
              state={instance.state}
              actions={instance.actions}
              isMobile={isMobile}
              getIconPosition={getIconPosition}
            />
          );
        })}

        {children}
      </div>
    </DesktopProvider>
  );
}

interface DesktopIconWrapperProps {
  config: DesktopIconConfig;
  onClick: () => void;
  onRegisterRef: (iconId: string, ref: RefObject<DesktopIconRef>) => void;
  isMobile: boolean;
}

function DesktopIconWrapper({
  config,
  onClick,
  onRegisterRef,
}: DesktopIconWrapperProps) {
  const ref = useRef<DesktopIconRef>(null);

  useEffect(() => {
    onRegisterRef(config.id, ref);
  }, [config.id, onRegisterRef]);

  return <DesktopIcon ref={ref} config={config} onClick={onClick} />;
}
