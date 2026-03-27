// Shared types for the marketing dashboard

export type Platform = "twitter" | "instagram" | "tiktok";

export interface PostSuggestion {
  id: string;
  type: "thread" | "single" | "quote-tweet";
  priority: "high" | "medium" | "low";
  hook: string;
  thread?: string[];
  timing: string;
  tags: string[];
  replyTo?: string;
  quoteOf?: string;
  status?: "pending" | "approved" | "rejected" | "posted";
  account?: "blueprint_os" | "blueprintIntern";
}

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
