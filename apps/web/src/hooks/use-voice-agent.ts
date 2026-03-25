"use client";

import { useCallback, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { elevenlabsEnabled, ELEVENLABS_AGENT_ID } from "@/lib/elevenlabs";

interface Message {
  source: "user" | "agent";
  text: string;
}

export function useVoiceAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [micPermission, setMicPermission] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");

  const conversation = useConversation({
    onMessage: ({ message, source }) => {
      setMessages((prev) => [
        ...prev,
        { source: source === "ai" ? "agent" : "user", text: message },
      ]);
    },
    onError: (message) => {
      console.error("ElevenLabs error:", message);
    },
  });

  const requestMicPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      return true;
    } catch {
      setMicPermission("denied");
      return false;
    }
  }, []);

  const start = useCallback(async () => {
    if (!elevenlabsEnabled) return;

    const hasPermission =
      micPermission === "granted" || (await requestMicPermission());
    if (!hasPermission) return;

    setMessages([]);
    await conversation.startSession({
      agentId: ELEVENLABS_AGENT_ID,
    });
  }, [conversation, micPermission, requestMicPermission]);

  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return {
    enabled: elevenlabsEnabled,
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    canSendFeedback: conversation.canSendFeedback,
    micPermission,
    messages,
    start,
    stop,
    sendFeedback: conversation.sendFeedback,
    requestMicPermission,
  };
}
