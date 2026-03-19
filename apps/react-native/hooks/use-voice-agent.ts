import { useCallback, useState } from "react";
import { elevenlabsEnabled, ELEVENLABS_AGENT_ID } from "@/lib/elevenlabs";

interface Message {
  source: "user" | "agent";
  text: string;
}

export function useVoiceAgent() {
  const [messages, setMessages] = useState<Message[]>([]);

  if (!elevenlabsEnabled) {
    return {
      enabled: false as const,
      status: "disconnected" as const,
      isSpeaking: false,
      canSendFeedback: false,
      messages: [] as Message[],
      start: async () => {},
      stop: async () => {},
      sendFeedback: (_like: boolean) => {},
    };
  }

  const {
    useConversation,
  } = require("@elevenlabs/react-native") as typeof import("@elevenlabs/react-native");

  const conversation = useConversation({
    onMessage: ({ message, source }: { message: string; source: string }) => {
      setMessages((prev) => [
        ...prev,
        { source: source === "ai" ? "agent" : "user", text: message },
      ]);
    },
    onError: (message: string) => {
      console.error("ElevenLabs error:", message);
    },
  });

  const start = useCallback(async () => {
    setMessages([]);
    await conversation.startSession({
      agentId: ELEVENLABS_AGENT_ID,
    });
  }, [conversation]);

  const stop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return {
    enabled: true as const,
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    canSendFeedback: conversation.canSendFeedback,
    messages,
    start,
    stop,
    sendFeedback: conversation.sendFeedback,
  };
}
