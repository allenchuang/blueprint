// Shared types for the marketing dashboard

export type Platform = "twitter" | "instagram" | "tiktok";

export interface Strategy {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  timeframe: string;
  tactics: string[];
  platform?: Platform | "all";
  category: "content" | "growth" | "engagement" | "partnerships" | "paid";
  status: "active" | "planned" | "completed";
}
