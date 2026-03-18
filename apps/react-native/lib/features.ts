export type Tier = "free" | "pro";

export const TIERS = ["free", "pro"] as const;

export const FEATURES = {
  basicAnalytics: ["free", "pro"],
  advancedAnalytics: ["pro"],
  exportData: ["pro"],
  prioritySupport: ["pro"],
  customBranding: ["pro"],
} as const satisfies Record<string, readonly Tier[]>;

export type FeatureKey = keyof typeof FEATURES;

export function hasFeature(tier: Tier, feature: FeatureKey): boolean {
  return (FEATURES[feature] as readonly string[]).includes(tier);
}
