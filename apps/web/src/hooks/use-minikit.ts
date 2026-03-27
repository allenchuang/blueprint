"use client";

import { MiniKit } from "@worldcoin/minikit-js";

export function useMiniKit() {
  return {
    isInstalled: MiniKit.isInstalled(),
    user: MiniKit.user,
    deviceProperties: MiniKit.deviceProperties,
    launchLocation: (MiniKit as unknown as Record<string, unknown>).launchLocation,
  };
}
