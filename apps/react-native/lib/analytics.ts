import { Platform } from "react-native";
import Constants from "expo-constants";

const GA_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID ?? "";
const GA_API_SECRET = process.env.EXPO_PUBLIC_GA_API_SECRET ?? "";

const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;

function getClientId(): string {
  const installationId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    `${Platform.OS}-anonymous`;
  return installationId;
}

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

async function sendEvent(
  name: string,
  params: EventParams = {}
): Promise<void> {
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    return;
  }

  const payload = {
    client_id: getClientId(),
    events: [
      {
        name,
        params: {
          ...params,
          platform: Platform.OS,
          app_version:
            Constants.expoConfig?.version ?? "unknown",
          engagement_time_msec: 100,
        },
      },
    ],
  };

  try {
    await fetch(GA4_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail — analytics should never break the app
  }
}

export const analytics = {
  /**
   * Track a screen view (equivalent to a page view on web).
   */
  screenView(screenName: string, screenClass?: string): void {
    void sendEvent("screen_view", {
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  },

  /**
   * Track a custom event.
   */
  event(name: string, params?: EventParams): void {
    void sendEvent(name, params);
  },

  /**
   * Track a user login event.
   */
  login(method: string): void {
    void sendEvent("login", { method });
  },

  /**
   * Track a user sign-up event.
   */
  signUp(method: string): void {
    void sendEvent("sign_up", { method });
  },
};
