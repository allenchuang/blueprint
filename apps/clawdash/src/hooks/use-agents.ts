"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import type { SessionInfo } from "@/hooks/use-sessions";

export interface AgentMeta {
  id: string;
  name: string;
  emoji: string;
}

export interface AgentStatus extends AgentMeta {
  status: "active" | "idle" | "offline";
  lastSeen?: string;
  sessionKey?: string;
  model?: string;
  messageCount?: number;
}

export function useAgents() {
  return useQuery<{ agents: AgentMeta[] }>({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/agents");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useAgentStatuses(sessions: SessionInfo[]) {
  const KNOWN_AGENTS: AgentMeta[] = [
    { id: "main", name: "Ash", emoji: "🔥" },
    { id: "ocean", name: "Ocean", emoji: "🌊" },
    { id: "skylar", name: "Skylar", emoji: "⚡" },
    { id: "coral", name: "Coral", emoji: "🪸" },
    { id: "arctic", name: "Arctic", emoji: "🧊" },
  ];

  return KNOWN_AGENTS.map((agent): AgentStatus => {
    // Match sessions by agent id in the session key/channel
    const agentSessions = sessions.filter(
      (s) =>
        s.channel?.toLowerCase().includes(agent.id) ||
        s.id.toLowerCase().includes(agent.id)
    );

    const latestSession = agentSessions.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

    if (!latestSession) {
      return { ...agent, status: "offline" };
    }

    const lastSeenMs =
      Date.now() - new Date(latestSession.updatedAt).getTime();
    const isActive = latestSession.status === "active";
    const isRecent = lastSeenMs < 5 * 60 * 1000; // 5 min

    return {
      ...agent,
      status: isActive ? "active" : isRecent ? "idle" : "offline",
      lastSeen: latestSession.updatedAt,
      sessionKey: latestSession.id,
      model: latestSession.model,
      messageCount: latestSession.messageCount,
    };
  });
}

export interface SendMessagePayload {
  message: string;
  agentId?: string;
  sessionKey?: string;
}

export interface SendMessageResponse {
  ok?: boolean;
  response?: string;
  error?: string;
  [key: string]: unknown;
}

export function useSendMessage() {
  return useMutation<SendMessageResponse, Error, SendMessagePayload>({
    mutationFn: async (payload) => {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
  });
}
