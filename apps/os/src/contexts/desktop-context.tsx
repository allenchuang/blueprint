"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  type RefObject,
} from "react";
import type { DesktopContextValue, WindowInstance } from "@/types";

const DesktopContext = createContext<DesktopContextValue | null>(null);

interface DesktopProviderProps {
  children: ReactNode;
  value: DesktopContextValue;
}

export function DesktopProvider({ children, value }: DesktopProviderProps) {
  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktopContext(): DesktopContextValue {
  const context = useContext(DesktopContext);

  if (!context) {
    return {
      windows: new Map<string, WindowInstance>(),
      openWindow: () => {
        console.warn(
          "useDesktopContext: openWindow called outside Desktop provider"
        );
      },
      closeWindow: () => {
        console.warn(
          "useDesktopContext: closeWindow called outside Desktop provider"
        );
      },
      minimizeWindow: () => {
        console.warn(
          "useDesktopContext: minimizeWindow called outside Desktop provider"
        );
      },
      restoreWindow: () => {
        console.warn(
          "useDesktopContext: restoreWindow called outside Desktop provider"
        );
      },
      focusWindow: () => {
        console.warn(
          "useDesktopContext: focusWindow called outside Desktop provider"
        );
      },
      deactivateAll: () => {
        console.warn(
          "useDesktopContext: deactivateAll called outside Desktop provider"
        );
      },
      getIconRef: () => null,
      registerIconRef: () => {
        console.warn(
          "useDesktopContext: registerIconRef called outside Desktop provider"
        );
      },
      isMobile: false,
      getNextCascadeIndex: () => 0,
    };
  }

  return context;
}

export function useWindow(windowId: string): WindowInstance | undefined {
  const { windows } = useDesktopContext();
  return windows.get(windowId);
}

export { DesktopContext };
