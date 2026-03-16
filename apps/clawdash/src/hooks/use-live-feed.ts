"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface FeedMessage {
  id: string;
  type: string;
  data: unknown;
  timestamp: string;
}

export function useLiveFeed() {
  const [messages, setMessages] = useState<FeedMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    const es = new EventSource("/api/live");
    eventSourceRef.current = es;

    es.addEventListener("connected", () => setConnected(true));
    es.addEventListener("disconnected", () => setConnected(false));

    es.addEventListener("message", (e) => {
      if (paused) return;
      try {
        const data = JSON.parse(e.data);
        const msg: FeedMessage = {
          id: String(++messageIdRef.current),
          type: data.type || "message",
          data,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [msg, ...prev].slice(0, 200));
      } catch {
        // skip malformed messages
      }
    });

    es.addEventListener("init", () => {
      setConnected(true);
    });

    es.onerror = () => {
      setConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [paused]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);
  const clear = useCallback(() => setMessages([]), []);

  return { messages, connected, paused, togglePause, clear };
}
