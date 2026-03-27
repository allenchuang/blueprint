"use client";

import { useQuery } from "@tanstack/react-query";

export interface SessionInfo {
  id: string;
  model: string;
  status: "active" | "idle" | "closed";
  tokensIn: number;
  tokensOut: number;
  costCents: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  channel?: string;
}

export function useSessions() {
  return useQuery<{ sessions: SessionInfo[] }>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions");
      return res.json();
    },
    refetchInterval: 5_000,
  });
}
