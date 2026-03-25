import { useEffect } from "react";
import { usePathname } from "expo-router";
import { analytics } from "@/lib/analytics";

/**
 * Automatically tracks screen views when the active route changes.
 * Place this hook in the root layout to track all navigation.
 */
export function useScreenTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.screenView(pathname);
    }
  }, [pathname]);
}
