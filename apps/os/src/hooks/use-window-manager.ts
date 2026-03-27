"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type {
  WindowConfig,
  WindowState,
  WindowActions,
  WindowInstance,
  UseWindowManagerReturn,
} from "@/types";
import {
  createClosedState,
  createOpenState,
  createMinimizedState,
  isWindowOpen,
  isWindowMinimized,
} from "@/types";

export function useWindowManager(
  windowConfigs: WindowConfig[]
): UseWindowManagerReturn {
  const nextZIndexRef = useRef(1);

  const [windowStates, setWindowStates] = useState<Map<string, WindowState>>(
    () => {
      const initial = new Map<string, WindowState>();
      for (const config of windowConfigs) {
        initial.set(config.id, createClosedState());
      }
      return initial;
    }
  );

  const openWindow = useCallback((id: string) => {
    setWindowStates((prev) => {
      const current = prev.get(id);
      if (!current) {
        console.warn(`useWindowManager: Window "${id}" not found`);
        return prev;
      }

      if (isWindowOpen(current)) {
        return prev;
      }

      const next = new Map(prev);

      for (const [windowId, state] of next) {
        if (isWindowOpen(state) && state.isActive) {
          next.set(windowId, { ...state, isActive: false });
        }
      }

      const zIndex = nextZIndexRef.current++;
      next.set(id, createOpenState(true, false, zIndex));

      return next;
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindowStates((prev) => {
      const current = prev.get(id);
      if (!current) {
        console.warn(`useWindowManager: Window "${id}" not found`);
        return prev;
      }

      const next = new Map(prev);
      next.set(id, createClosedState());
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindowStates((prev) => {
      const current = prev.get(id);
      if (!current || !isWindowOpen(current)) {
        return prev;
      }

      const next = new Map(prev);
      next.set(id, createMinimizedState(current.zIndex));
      return next;
    });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindowStates((prev) => {
      const current = prev.get(id);
      if (!current || !isWindowMinimized(current)) {
        return prev;
      }

      const next = new Map(prev);

      for (const [windowId, state] of next) {
        if (isWindowOpen(state) && state.isActive) {
          next.set(windowId, { ...state, isActive: false });
        }
      }

      const zIndex = nextZIndexRef.current++;
      next.set(id, createOpenState(true, false, zIndex));

      return next;
    });
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindowStates((prev) => {
      const current = prev.get(id);
      if (!current || !isWindowOpen(current)) {
        return prev;
      }

      if (current.isActive) {
        return prev;
      }

      const next = new Map(prev);

      for (const [windowId, state] of next) {
        if (isWindowOpen(state) && state.isActive) {
          next.set(windowId, { ...state, isActive: false });
        }
      }

      const zIndex = nextZIndexRef.current++;
      next.set(id, {
        ...current,
        isActive: true,
        zIndex,
      });

      return next;
    });
  }, []);

  const deactivateAll = useCallback(() => {
    setWindowStates((prev) => {
      let hasActive = false;
      for (const state of prev.values()) {
        if (isWindowOpen(state) && state.isActive) {
          hasActive = true;
          break;
        }
      }

      if (!hasActive) return prev;

      const next = new Map(prev);
      for (const [windowId, state] of next) {
        if (isWindowOpen(state) && state.isActive) {
          next.set(windowId, { ...state, isActive: false });
        }
      }
      return next;
    });
  }, []);

  const createActions = useCallback(
    (windowId: string): WindowActions => ({
      open: () => openWindow(windowId),
      close: () => closeWindow(windowId),
      minimize: () => minimizeWindow(windowId),
      restore: () => restoreWindow(windowId),
      maximize: () => {
        setWindowStates((prev) => {
          const current = prev.get(windowId);
          if (!current || !isWindowOpen(current)) return prev;
          const next = new Map(prev);
          next.set(windowId, { ...current, isMaximized: true });
          return next;
        });
      },
      unmaximize: () => {
        setWindowStates((prev) => {
          const current = prev.get(windowId);
          if (!current || !isWindowOpen(current)) return prev;
          const next = new Map(prev);
          next.set(windowId, { ...current, isMaximized: false });
          return next;
        });
      },
      toggleMaximize: () => {
        setWindowStates((prev) => {
          const current = prev.get(windowId);
          if (!current || !isWindowOpen(current)) return prev;
          const next = new Map(prev);
          next.set(windowId, {
            ...current,
            isMaximized: !current.isMaximized,
          });
          return next;
        });
      },
      focus: () => focusWindow(windowId),
    }),
    [openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow]
  );

  const windows = useMemo(() => {
    const result = new Map<string, WindowInstance>();

    for (const config of windowConfigs) {
      const state = windowStates.get(config.id) || createClosedState();
      const actions = createActions(config.id);

      result.set(config.id, {
        config,
        state,
        actions,
      });
    }

    return result;
  }, [windowConfigs, windowStates, createActions]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    deactivateAll,
  };
}
