import { ReactNode, ReactElement, ComponentType, RefObject } from "react";

export type WindowType = "app" | "browser";

export interface FixedDimensions {
  responsive: false;
  width: string;
  height: string;
  minWidth?: number;
  minHeight?: number;
  initialX?: number;
  initialY?: number;
}

export interface BreakpointDimensions {
  width: string;
  height: string;
  minWidth?: number;
  minHeight?: number;
  initialX?: number;
  initialY?: number;
}

export interface ResponsiveDimensions {
  responsive: true;
  mobile?: BreakpointDimensions;
  tablet?: BreakpointDimensions;
  desktop?: BreakpointDimensions;
}

export type WindowDimensions = FixedDimensions | ResponsiveDimensions;

export function isResponsiveDimensions(
  dims: WindowDimensions
): dims is ResponsiveDimensions {
  return dims.responsive === true;
}

export function isFixedDimensions(
  dims: WindowDimensions
): dims is FixedDimensions {
  return dims.responsive === false;
}

interface WindowConfigBase {
  id: string;
  title: string;
  icon?: ReactElement;
  dimensions?: WindowDimensions;
  canMinimize?: boolean;
  canMaximize?: boolean;
  canResize?: boolean;
  hideTitleBar?: boolean;
  openMaximized?: boolean;
}

export interface AppWindowConfig extends WindowConfigBase {
  type: "app";
  component: ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
}

export interface BrowserWindowConfig extends WindowConfigBase {
  type: "browser";
  url: string;
  showReloadButton?: boolean;
  sandbox?: string;
  allow?: string;
  referrerPolicy?: ReferrerPolicy;
}

export type WindowConfig = AppWindowConfig | BrowserWindowConfig;

export function isAppWindow(
  config: WindowConfig
): config is AppWindowConfig {
  return config.type === "app";
}

export function isBrowserWindow(
  config: WindowConfig
): config is BrowserWindowConfig {
  return config.type === "browser";
}

export interface DesktopIconConfig {
  id: string;
  windowId: string;
  icon: ReactElement | string;
  label: string;
  initialX?: number;
  initialY?: number;
}

export interface ColorBackground {
  type: "color";
  color: string;
  overlay?: string;
}

export interface ImageBackground {
  type: "image";
  url: string;
  size?: "cover" | "contain" | "auto" | string;
  position?: string;
  overlay?: string;
}

export interface GradientBackground {
  type: "gradient";
  gradient: string;
  overlay?: string;
}

export type BackgroundConfig =
  | ColorBackground
  | ImageBackground
  | GradientBackground;

export interface IconLayoutConfig {
  startPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  direction: "vertical" | "horizontal";
  gap: number;
  padding: number;
}

export interface DesktopConfig {
  windows: WindowConfig[];
  icons: DesktopIconConfig[];
  background?: BackgroundConfig;
  darkBackground?: BackgroundConfig;
  lightBackground?: BackgroundConfig;
  iconLayout?: IconLayoutConfig;
  autoOpenWindow?: string;
  onReady?: () => void;
}

export interface ClosedWindowState {
  status: "closed";
}

export interface OpenWindowState {
  status: "open";
  isActive: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface MinimizedWindowState {
  status: "minimized";
  zIndex: number;
}

export type WindowState =
  | ClosedWindowState
  | OpenWindowState
  | MinimizedWindowState;

export function isWindowClosed(
  state: WindowState
): state is ClosedWindowState {
  return state.status === "closed";
}

export function isWindowOpen(
  state: WindowState
): state is OpenWindowState {
  return state.status === "open";
}

export function isWindowMinimized(
  state: WindowState
): state is MinimizedWindowState {
  return state.status === "minimized";
}

export function createClosedState(): ClosedWindowState {
  return { status: "closed" };
}

export function createOpenState(
  isActive: boolean = false,
  isMaximized: boolean = false,
  zIndex: number = 1
): OpenWindowState {
  return { status: "open", isActive, isMaximized, zIndex };
}

export function createMinimizedState(
  zIndex: number = 1
): MinimizedWindowState {
  return { status: "minimized", zIndex };
}

export interface WindowActions {
  open: () => void;
  close: () => void;
  minimize: () => void;
  restore: () => void;
  maximize: () => void;
  unmaximize: () => void;
  toggleMaximize: () => void;
  focus: () => void;
}

export interface WindowInstance {
  config: WindowConfig;
  state: WindowState;
  actions: WindowActions;
}

export interface WindowManagerCore {
  windows: Map<string, WindowInstance>;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  deactivateAll: () => void;
}

export interface DesktopIconRef {
  getPosition: () => { x: number; y: number };
}

export interface DesktopContextValue extends WindowManagerCore {
  getIconRef: (iconId: string) => RefObject<DesktopIconRef | null> | null;
  registerIconRef: (
    iconId: string,
    ref: RefObject<DesktopIconRef | null>
  ) => void;
  isMobile: boolean;
  getNextCascadeIndex: () => number;
}

export type UseWindowManagerReturn = WindowManagerCore;

export interface DesktopProps {
  config: DesktopConfig;
  children?: ReactNode;
  className?: string;
}

export interface WindowComponentProps {
  config: WindowConfig;
  state: WindowState;
  actions: WindowActions;
  iconPosition?: { x: number; y: number };
  getIconPosition?: () => { x: number; y: number };
  isMobile?: boolean;
}

export interface DesktopIconComponentProps {
  config: DesktopIconConfig;
  onClick: () => void;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDesktopConfig(
  config: DesktopConfig
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const windowIds = new Set<string>();
  const iconIds = new Set<string>();

  if (!config.windows || !Array.isArray(config.windows)) {
    errors.push('Config must have a "windows" array');
    return { valid: false, errors, warnings };
  }

  if (!config.icons || !Array.isArray(config.icons)) {
    errors.push('Config must have an "icons" array');
    return { valid: false, errors, warnings };
  }

  for (const window of config.windows) {
    if (!window.id) {
      errors.push('Window is missing required "id" field');
      continue;
    }

    if (windowIds.has(window.id)) {
      errors.push(`Duplicate window ID: "${window.id}"`);
    }
    windowIds.add(window.id);

    if (!window.title) {
      warnings.push(`Window "${window.id}" is missing a title`);
    }

    if (window.type === "app") {
      if (!window.component) {
        errors.push(
          `App window "${window.id}" is missing required "component" field`
        );
      }
    } else if (window.type === "browser") {
      if (!window.url) {
        errors.push(
          `Browser window "${window.id}" is missing required "url" field`
        );
      }
    }
  }

  for (const icon of config.icons) {
    if (!icon.id) {
      errors.push('Icon is missing required "id" field');
      continue;
    }

    if (iconIds.has(icon.id)) {
      errors.push(`Duplicate icon ID: "${icon.id}"`);
    }
    iconIds.add(icon.id);

    if (!icon.windowId) {
      errors.push(
        `Icon "${icon.id}" is missing required "windowId" field`
      );
    } else if (!windowIds.has(icon.windowId)) {
      errors.push(
        `Icon "${icon.id}" references non-existent window "${icon.windowId}"`
      );
    }

    if (!icon.label) {
      warnings.push(`Icon "${icon.id}" is missing a label`);
    }

    if (!icon.icon) {
      errors.push(
        `Icon "${icon.id}" is missing required "icon" field`
      );
    }
  }

  if (config.autoOpenWindow && !windowIds.has(config.autoOpenWindow)) {
    errors.push(
      `autoOpenWindow references non-existent window "${config.autoOpenWindow}"`
    );
  }

  for (const windowId of windowIds) {
    const hasIcon = config.icons.some(
      (icon) => icon.windowId === windowId
    );
    if (!hasIcon) {
      warnings.push(
        `Window "${windowId}" has no icon - it can only be opened programmatically`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function assertValidConfig(config: DesktopConfig): void {
  const result = validateDesktopConfig(config);
  if (!result.valid) {
    throw new Error(
      `Invalid DesktopConfig:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}
