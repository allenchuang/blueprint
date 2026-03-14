import type { AppConfig } from "./types.js";

export const appConfig = {
  name: "Mastermind",
  slug: "mastermind",
  description: "Build your next big thing",
  slogan: "Ship ideas at the speed of thought",
  version: "0.1.0",

  colors: {
    primary: "#0D9373",
  },

  urls: {
    website: "https://example.com",
    api: "http://localhost:3001",
    docs: "https://docs.example.com",
    supportEmail: "support@example.com",
  },

  mobile: {
    bundleId: "com.mastermind.app",
    scheme: "mastermind",
  },

  socials: {
    github: "https://github.com",
  },
} satisfies AppConfig;
