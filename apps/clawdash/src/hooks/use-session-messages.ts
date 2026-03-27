"use client";

import { useQuery } from "@tanstack/react-query";

export interface SessionMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: string;
}

export function useSessionMessages(
  sessionId: string | null,
  agentId?: string,
  limit = 50
) {
  return useQuery<{ messages: SessionMessage[] }>({
    queryKey: ["session-messages", sessionId, agentId, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ sessionId: sessionId! });
      if (agentId) params.set("agentId", agentId);
      params.set("limit", String(limit));
      const res = await fetch(`/api/session-messages?${params}`);
      return res.json();
    },
    enabled: !!sessionId,
    staleTime: 10_000,
  });
}
