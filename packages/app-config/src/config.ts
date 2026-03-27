import type { AppConfig } from "./types";

export const appConfig = {
  name: "Blueprint",
  slug: "blueprint",
  description: "Build your next big thing",
  slogan: "Ship ideas at the speed of thought",
  version: "0.1.0",

  colors: {
    primary: "#38BDF8",
  },

  design: {
    fonts: {
      heading: "Instrument Serif",
      body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    defaultTheme: "system",
    radius: "0.625rem",
  },

  urls: {
    website: "https://example.com",
    api: "http://localhost:3001",
    docs: "https://docs.example.com",
    supportEmail: "support@example.com",
  },

  mobile: {
    bundleId: "com.blueprint.app",
    scheme: "blueprint",
  },

  socials: {
    github: "https://github.com",
  },
} satisfies AppConfig;
