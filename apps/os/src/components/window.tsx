"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ComponentType,
} from "react";
import type {
  WindowConfig,
  WindowState,
  WindowActions,
  AppWindowConfig,
  BrowserWindowConfig,
} from "@/types";
import {
  isWindowOpen,
  isWindowMinimized,
  isAppWindow,
  isBrowserWindow,
} from "@/types";
import {
  useThemeOptional,
  darkTheme,
} from "@/contexts/theme-context";
import { useDesktopContext } from "@/contexts/desktop-context";

export interface WindowProps {
  config: WindowConfig;
  state: WindowState;
  actions: WindowActions;
  iconPosition?: { x: number; y: number };
  getIconPosition?: () => { x: number; y: number };
  isMobile?: boolean;
  initialX?: number;
  initialY?: number;
  width?: string;
  height?: string;
}

type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | null;

function parseSize(size: string): number {
  if (typeof window === "undefined") return parseFloat(size);
  if (size.endsWith("vw")) return (parseFloat(size) / 100) * window.innerWidth;
  if (size.endsWith("vh")) return (parseFloat(size) / 100) * window.innerHeight;
  return parseFloat(size);
}

const DEFAULT_APP_DIMENSIONS = { width: "650px", height: "500px", minWidth: 400, minHeight: 300 };
const DEFAULT_BROWSER_DIMENSIONS = { width: "1000px", height: "700px", minWidth: 500, minHeight: 400 };
const CASCADE_OFFSET = 30;

export function Window({
  config,
  state,
  actions,
  iconPosition,
  getIconPosition,
  isMobile = false,
  initialX,
  initialY,
  width,
  height,
}: WindowProps) {
  const { getNextCascadeIndex } = useDesktopContext();

  const isBrowserType = isBrowserWindow(config);
  const defaults = isBrowserType ? DEFAULT_BROWSER_DIMENSIONS : DEFAULT_APP_DIMENSIONS;

  const cascadeIndex = useRef<number | null>(null);
  if (cascadeIndex.current === null) cascadeIndex.current = getNextCascadeIndex();
  const cascadeOffset = cascadeIndex.current * CASCADE_OFFSET;

  const getCenteredX = () => {
    if (typeof window === "undefined") return 100 + cascadeOffset;
    return Math.max(50, (window.innerWidth - parseSize(width ?? defaults.width)) / 2 + cascadeOffset);
  };
  const getCenteredY = () => {
    if (typeof window === "undefined") return 50 + cascadeOffset;
    return Math.max(30, (window.innerHeight - parseSize(height ?? defaults.height)) / 2 - 50 + cascadeOffset);
  };

  const defaultX = initialX ?? getCenteredX();
  const defaultY = initialY ?? getCenteredY();
  const defaultWidth = width ?? defaults.width;
  const defaultHeight = height ?? defaults.height;
  const minWidth = defaults.minWidth;
  const minHeight = defaults.minHeight;

  const canMinimize = config.canMinimize !== false;
  const canMaximize = config.canMaximize !== false && !isMobile;
  const canResize = config.canResize !== false && !isMobile;
  const hideTitleBar = config.hideTitleBar === true;

  const hasIconAnimation = iconPosition !== undefined;
  const shouldOpenMaximized = isMobile || config.openMaximized === true;

  // ── position/size live in refs for drag/resize, synced to state for render ──
  const posRef = useRef({ x: defaultX, y: defaultY });
  const sizeRef = useRef({
    width: parseSize(defaultWidth),
    height: parseSize(defaultHeight),
  });

  const [position, setPosition] = useState(() => {
    if (hasIconAnimation) return { x: iconPosition.x, y: iconPosition.y };
    if (shouldOpenMaximized) return { x: 0, y: 0 };
    return { x: defaultX, y: defaultY };
  });
  const [size, setSize] = useState(() => {
    if (hasIconAnimation) return { width: 60, height: 60 };
    if (shouldOpenMaximized && typeof window !== "undefined")
      return { width: window.innerWidth, height: window.innerHeight };
    return { width: parseSize(defaultWidth), height: parseSize(defaultHeight) };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [isMaximized, setIsMaximized] = useState(shouldOpenMaximized);
  const [isSnapped, setIsSnapped] = useState<"left" | "right" | null>(null);
  const [snapZone, setSnapZone] = useState<"top" | "left" | "right" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOpening, setIsOpening] = useState(hasIconAnimation);
  const [isClosing, setIsClosing] = useState(false);
  const [opacity, setOpacity] = useState(hasIconAnimation ? 0 : 1);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState<string | null>(null);

  const isAnimating = useRef(false);
  const savedPosition = useRef({ x: defaultX, y: defaultY });
  const savedSize = useRef({ width: parseSize(defaultWidth), height: parseSize(defaultHeight) });
  const previousStateRef = useRef({
    x: defaultX, y: defaultY,
    width: parseSize(defaultWidth), height: parseSize(defaultHeight),
  });

  // ── drag state (all refs, no state dependency) ──
  const dragActive = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragNeedsRestore = useRef(false);
  const dragInitialClient = useRef({ x: 0, y: 0 });
  const snapZoneRef = useRef<"top" | "left" | "right" | null>(null);
  const isMaximizedRef = useRef(isMaximized);
  const isSnappedRef = useRef(isSnapped);

  // keep refs in sync with state
  useEffect(() => { isMaximizedRef.current = isMaximized; }, [isMaximized]);
  useEffect(() => { isSnappedRef.current = isSnapped; }, [isSnapped]);

  // ── resize state (all refs) ──
  const resizeActive = useRef(false);
  const resizeDirection = useRef<ResizeDirection>(null);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isOpen = isWindowOpen(state);
  const isMinimized = isWindowMinimized(state);
  const isActive = isOpen && state.isActive;
  const zIndex = isOpen ? state.zIndex : isMinimized ? state.zIndex : 0;

  const themeContext = useThemeOptional();
  const colors = themeContext?.colors ?? darkTheme;

  const handleClose = useCallback(() => actions.close(), [actions]);

  const handleMinimize = useCallback(() => {
    if (isAnimating.current || !canMinimize) return;
    const currentIconPos = getIconPosition?.() ?? iconPosition;
    if (currentIconPos) {
      isAnimating.current = true;
      savedPosition.current = { ...posRef.current };
      savedSize.current = { ...sizeRef.current };
      setIsClosing(true);
      setIsTransitioning(true);
      setPosition(currentIconPos);
      setSize({ width: 60, height: 60 });
      setOpacity(0);
      setTimeout(() => { isAnimating.current = false; actions.minimize(); }, 300);
    } else {
      actions.minimize();
    }
  }, [actions, canMinimize, getIconPosition, iconPosition]);

  const handleMaximize = useCallback(() => {
    if (!canMaximize) return;
    setIsTransitioning(true);
    if (isMaximizedRef.current) {
      const prev = previousStateRef.current;
      posRef.current = { x: prev.x, y: prev.y };
      sizeRef.current = { width: prev.width, height: prev.height };
      setPosition({ x: prev.x, y: prev.y });
      setSize({ width: prev.width, height: prev.height });
      setIsMaximized(false);
    } else {
      previousStateRef.current = { ...posRef.current, ...sizeRef.current };
      posRef.current = { x: 0, y: 0 };
      sizeRef.current = { width: window.innerWidth, height: window.innerHeight };
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMaximized(true);
    }
    setTimeout(() => setIsTransitioning(false), 200);
    actions.toggleMaximize();
  }, [actions, canMaximize]);

  const handleReload = useCallback(() => {
    if (isBrowserWindow(config)) {
      setIframeLoading(true);
      setIframeError(null);
      if (iframeRef.current) {
        const src = iframeRef.current.src;
        iframeRef.current.src = "";
        iframeRef.current.src = src;
      }
    }
  }, [config]);

  const handleIframeLoad = useCallback(() => { setIframeLoading(false); setIframeError(null); }, []);
  const handleIframeError = useCallback(() => {
    setIframeLoading(false);
    setIframeError("Failed to load content. The site may block embedding.");
  }, []);

  // ── opening animation ──
  useEffect(() => {
    if (!isOpening || !hasIconAnimation) return;
    setIsTransitioning(true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const newPos = { x: defaultX, y: defaultY };
      const newSize = { width: parseSize(defaultWidth), height: parseSize(defaultHeight) };
      posRef.current = newPos;
      sizeRef.current = newSize;
      setPosition(newPos);
      setSize(newSize);
      setOpacity(1);
      setTimeout(() => {
        setIsTransitioning(false);
        setIsOpening(false);
        savedPosition.current = newPos;
        savedSize.current = newSize;
      }, 300);
    }));
  }, [isOpening, hasIconAnimation, defaultX, defaultY, defaultWidth, defaultHeight]);

  // ── restore from minimize animation ──
  useEffect(() => {
    if (!isMinimized && isClosing && !isAnimating.current) {
      isAnimating.current = true;
      setIsTransitioning(true);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        posRef.current = savedPosition.current;
        sizeRef.current = savedSize.current;
        setPosition(savedPosition.current);
        setSize(savedSize.current);
        setOpacity(1);
        setTimeout(() => {
          setIsTransitioning(false);
          setIsClosing(false);
          isAnimating.current = false;
        }, 300);
      }));
    }
  }, [isMinimized, isClosing]);

  // ── DRAG: pointer capture on title bar ──
  const handleDragPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (!isActive) actions.focus();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragActive.current = true;
    dragNeedsRestore.current = isMaximizedRef.current || isSnappedRef.current !== null;
    dragInitialClient.current = { x: e.clientX, y: e.clientY };
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    setIsDragging(true);
  }, [actions, isActive]);

  const handleDragPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return;

    const SNAP_THRESHOLD = 10;

    if (dragNeedsRestore.current) {
      const deltaX = Math.abs(e.clientX - dragInitialClient.current.x);
      const deltaY = Math.abs(e.clientY - dragInitialClient.current.y);
      if (deltaX < 2 && deltaY < 2) return;

      const prevWidth = previousStateRef.current.width;
      const cursorRatioX = e.clientX / window.innerWidth;
      const newX = Math.max(0, e.clientX - prevWidth * cursorRatioX);
      const newY = Math.max(0, e.clientY - 24);

      posRef.current = { x: newX, y: newY };
      dragOffset.current = { x: e.clientX - newX, y: e.clientY - newY };
      dragNeedsRestore.current = false;

      setIsTransitioning(true);
      setPosition({ x: newX, y: newY });
      setSize({ width: prevWidth, height: previousStateRef.current.height });
      sizeRef.current = { width: prevWidth, height: previousStateRef.current.height };
      setIsMaximized(false);
      setIsSnapped(null);
      setTimeout(() => setIsTransitioning(false), 150);
      return;
    }

    const newX = e.clientX - dragOffset.current.x;
    const newY = Math.max(0, e.clientY - dragOffset.current.y);
    posRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });

    // snap zones
    let zone: "top" | "left" | "right" | null = null;
    if (e.clientY <= SNAP_THRESHOLD) zone = "top";
    else if (e.clientX <= SNAP_THRESHOLD) zone = "left";
    else if (e.clientX >= window.innerWidth - SNAP_THRESHOLD) zone = "right";
    snapZoneRef.current = zone;
    setSnapZone(zone);
  }, []);

  const handleDragPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return;
    dragActive.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    const zone = snapZoneRef.current;
    if (zone) {
      if (!isMaximizedRef.current && !isSnappedRef.current) {
        previousStateRef.current = { ...savedPosition.current, ...savedSize.current };
      }
      setIsTransitioning(true);
      if (zone === "top") {
        posRef.current = { x: 0, y: 0 };
        sizeRef.current = { width: window.innerWidth, height: window.innerHeight };
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth, height: window.innerHeight });
        setIsMaximized(true);
        setIsSnapped(null);
      } else if (zone === "left") {
        posRef.current = { x: 0, y: 0 };
        sizeRef.current = { width: window.innerWidth / 2, height: window.innerHeight };
        setPosition({ x: 0, y: 0 });
        setSize({ width: window.innerWidth / 2, height: window.innerHeight });
        setIsSnapped("left");
        setIsMaximized(false);
      } else {
        posRef.current = { x: window.innerWidth / 2, y: 0 };
        sizeRef.current = { width: window.innerWidth / 2, height: window.innerHeight };
        setPosition({ x: window.innerWidth / 2, y: 0 });
        setSize({ width: window.innerWidth / 2, height: window.innerHeight });
        setIsSnapped("right");
        setIsMaximized(false);
      }
      setTimeout(() => setIsTransitioning(false), 200);
      snapZoneRef.current = null;
      setSnapZone(null);
    } else if (!isMaximizedRef.current && !isSnappedRef.current) {
      savedPosition.current = { ...posRef.current };
      savedSize.current = { ...sizeRef.current };
    }

    setIsDragging(false);
  }, []);

  // ── RESIZE: pointer capture on resize handles ──
  const handleResizePointerDown = useCallback((e: React.PointerEvent, direction: ResizeDirection) => {
    if (!canResize || e.button !== 0) return;
    if (!isActive) actions.focus();
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    resizeActive.current = true;
    resizeDirection.current = direction;
    resizeStart.current = {
      x: e.clientX, y: e.clientY,
      width: sizeRef.current.width, height: sizeRef.current.height,
      posX: posRef.current.x, posY: posRef.current.y,
    };
    setIsResizing(direction);
  }, [actions, canResize, isActive]);

  const handleResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizeActive.current) return;
    const dir = resizeDirection.current;
    if (!dir) return;

    const s = resizeStart.current;
    const deltaX = e.clientX - s.x;
    const deltaY = e.clientY - s.y;

    let newWidth = s.width;
    let newHeight = s.height;
    let newX = s.posX;
    let newY = s.posY;

    if (dir.includes("right")) newWidth = Math.max(minWidth, s.width + deltaX);
    if (dir.includes("left")) {
      const w = s.width - deltaX;
      if (w >= minWidth) { newWidth = w; newX = s.posX + deltaX; }
    }
    if (dir.includes("bottom")) newHeight = Math.max(minHeight, s.height + deltaY);
    if (dir.includes("top")) {
      const h = s.height - deltaY;
      const y = s.posY + deltaY;
      if (h >= minHeight && y >= 0) { newHeight = h; newY = y; }
    }

    posRef.current = { x: newX, y: newY };
    sizeRef.current = { width: newWidth, height: newHeight };
    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  }, [minWidth, minHeight]);

  const handleResizePointerUp = useCallback((e: React.PointerEvent) => {
    if (!resizeActive.current) return;
    resizeActive.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    savedPosition.current = { ...posRef.current };
    savedSize.current = { ...sizeRef.current };
    setIsResizing(null);
  }, []);

  const handleWindowMouseDown = useCallback(() => {
    if (!isActive) actions.focus();
  }, [actions, isActive]);

  const handleTitleBarDoubleClick = useCallback(() => {
    if (!isMobile && canMaximize) handleMaximize();
  }, [isMobile, canMaximize, handleMaximize]);

  const snapPreviewStyle = snapZone ? {
    top: 8,
    left: snapZone === "right" ? window.innerWidth / 2 + 4 : 8,
    width: snapZone === "top" ? window.innerWidth - 16 : window.innerWidth / 2 - 12,
    height: window.innerHeight - 16,
  } : null;

  if (!isOpen && !isMinimized) return null;
  if (isMinimized && !isClosing) return null;

  const isBrowser = isBrowserWindow(config);
  const isApp = isAppWindow(config);

  return (
    <>
      {snapZone && snapPreviewStyle && (
        <div
          className="fixed rounded-xl border-2 border-white/40 bg-white/10 backdrop-blur-sm pointer-events-none z-[100] transition-all duration-150"
          style={{ top: snapPreviewStyle.top, left: snapPreviewStyle.left, width: snapPreviewStyle.width, height: snapPreviewStyle.height }}
        />
      )}

      <div
        className={`absolute ${isTransitioning ? (isOpening || isClosing ? "transition-all duration-300 ease-out" : "transition-all duration-200") : ""} ${!isMaximized && !isMobile ? "rounded-2xl" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          opacity,
          zIndex: isActive ? 50 + zIndex : 40 + zIndex,
          boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.8), 0 12px 40px -8px rgba(0, 0, 0, 0.6)",
          pointerEvents: isMinimized ? "none" : "auto",
          userSelect: isDragging || isResizing ? "none" : "auto",
        }}
        onMouseDown={handleWindowMouseDown}
      >
        <div
          className={`relative w-full h-full backdrop-blur-xl overflow-hidden ${!isMaximized && !isMobile ? "rounded-2xl" : ""}`}
          style={{ backgroundColor: colors.windowBg, borderWidth: "1px", borderStyle: "solid", borderColor: colors.border }}
        >
          {!hideTitleBar && (
            <div
              className={`h-12 flex items-center px-4 select-none transition-colors ${isMobile ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"} ${!isMaximized && !isMobile ? "rounded-t-2xl" : ""}`}
              style={{
                backgroundColor: isActive ? colors.titleBarBg : colors.titleBarBgInactive,
                borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: colors.border,
                touchAction: "none",
              }}
              onPointerDown={handleDragPointerDown}
              onPointerMove={handleDragPointerMove}
              onPointerUp={handleDragPointerUp}
              onPointerCancel={handleDragPointerUp}
              onDoubleClick={handleTitleBarDoubleClick}
            >
              <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                <button
                  onClick={handleClose}
                  className={`w-3 h-3 rounded-full transition-colors ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-zinc-600"}`}
                  aria-label="Close"
                />
                <button
                  onClick={canMinimize ? handleMinimize : undefined}
                  disabled={!canMinimize}
                  className={`w-3 h-3 rounded-full transition-colors ${!canMinimize ? "bg-zinc-600 cursor-not-allowed" : isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-zinc-600"}`}
                  aria-label="Minimize"
                />
                <button
                  onClick={canMaximize ? handleMaximize : undefined}
                  disabled={!canMaximize}
                  className={`w-3 h-3 rounded-full transition-colors ${!canMaximize ? "bg-zinc-600 cursor-not-allowed" : isActive ? "bg-green-500 hover:bg-green-600" : "bg-zinc-600"}`}
                  aria-label="Maximize"
                />
              </div>

              {isBrowser ? (
                <div className="flex-1 flex items-center gap-2 ml-3">
                  {(config as BrowserWindowConfig).showReloadButton !== false && (
                    <button
                      onClick={handleReload}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ color: colors.textSecondary }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBg; e.currentTarget.style.color = colors.textPrimary; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = colors.textSecondary; }}
                      aria-label="Reload"
                    >
                      <ReloadIcon />
                    </button>
                  )}
                  <div className="flex-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm" style={{ backgroundColor: colors.urlBarBg, color: colors.textSecondary }}>
                    <span className={`transition-all ${isActive ? "" : "grayscale opacity-50"}`}>{config.icon}</span>
                    <span className="truncate">{config.title}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                  <span className={`transition-all ${isActive ? "" : "grayscale opacity-50"}`}>{config.icon}</span>
                  <span>{config.title}</span>
                </div>
              )}
            </div>
          )}

          <div className={`relative ${hideTitleBar ? "h-full" : "h-[calc(100%-3rem)]"} overflow-auto`}>
            {isApp && <AppContent config={config as AppWindowConfig} />}
            {isBrowser && (
              <BrowserContent
                config={config as BrowserWindowConfig}
                iframeRef={iframeRef}
                isLoading={iframeLoading}
                error={iframeError}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                onRetry={handleReload}
                colors={colors}
              />
            )}
            {!isActive && (
              <div className="absolute inset-0 z-10" onMouseDown={handleWindowMouseDown} />
            )}
          </div>
        </div>

        {canResize && !isMaximized && (
          <>
            {/* corners */}
            {(["top-left", "top-right", "bottom-left", "bottom-right"] as ResizeDirection[]).map((dir) => (
              <div
                key={dir!}
                className={`absolute w-4 h-4 z-20 ${dir!.includes("top") ? "top-0" : "bottom-0"} ${dir!.includes("left") ? "left-0" : "right-0"} ${dir === "top-left" || dir === "bottom-right" ? "cursor-nwse-resize" : "cursor-nesw-resize"}`}
                style={{ touchAction: "none" }}
                onPointerDown={(e) => handleResizePointerDown(e, dir)}
                onPointerMove={handleResizePointerMove}
                onPointerUp={handleResizePointerUp}
                onPointerCancel={handleResizePointerUp}
              />
            ))}
            {/* edges */}
            <div className="absolute top-0 left-4 right-4 h-1.5 cursor-ns-resize z-20" style={{ touchAction: "none" }} onPointerDown={(e) => handleResizePointerDown(e, "top")} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} onPointerCancel={handleResizePointerUp} />
            <div className="absolute bottom-0 left-4 right-4 h-1.5 cursor-ns-resize z-20" style={{ touchAction: "none" }} onPointerDown={(e) => handleResizePointerDown(e, "bottom")} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} onPointerCancel={handleResizePointerUp} />
            <div className="absolute left-0 top-4 bottom-4 w-1.5 cursor-ew-resize z-20" style={{ touchAction: "none" }} onPointerDown={(e) => handleResizePointerDown(e, "left")} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} onPointerCancel={handleResizePointerUp} />
            <div className="absolute right-0 top-4 bottom-4 w-1.5 cursor-ew-resize z-20" style={{ touchAction: "none" }} onPointerDown={(e) => handleResizePointerDown(e, "right")} onPointerMove={handleResizePointerMove} onPointerUp={handleResizePointerUp} onPointerCancel={handleResizePointerUp} />
          </>
        )}
      </div>
    </>
  );
}

function AppContent({ config }: { config: AppWindowConfig }) {
  const Component = config.component as ComponentType<Record<string, unknown>>;
  return <Component {...(config.componentProps ?? {})} />;
}

function ReloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function BrowserContent({
  config, iframeRef, isLoading, error, onLoad, onError, onRetry, colors,
}: {
  config: BrowserWindowConfig;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isLoading: boolean;
  error: string | null;
  onLoad: () => void;
  onError: () => void;
  onRetry: () => void;
  colors: { overlayBg: string; textSecondary: string; textPrimary: string; border: string; hoverBg: string };
}) {
  return (
    <div className="relative w-full h-full" style={{ backgroundColor: colors.overlayBg }}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ backgroundColor: colors.overlayBg }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-t-blue-500 rounded-full animate-spin" style={{ borderColor: colors.border, borderTopColor: "#3b82f6" }} />
            <span className="text-sm" style={{ color: colors.textSecondary }}>Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ backgroundColor: colors.overlayBg }}>
          <div className="flex flex-col items-center gap-4 max-w-sm text-center px-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium mb-1" style={{ color: colors.textPrimary }}>Unable to load</h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{error}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onRetry} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">Try Again</button>
              <a href={config.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ backgroundColor: colors.hoverBg, color: colors.textPrimary }}>Open Externally</a>
            </div>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={config.url}
        className={`w-full h-full border-0 transition-opacity duration-300 ${isLoading || error ? "opacity-0" : "opacity-100"}`}
        title={config.title}
        sandbox={config.sandbox}
        allow={config.allow}
        referrerPolicy={config.referrerPolicy}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}
