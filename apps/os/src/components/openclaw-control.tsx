"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST;
const API_BASE = APP_HOST
  ? `http://${APP_HOST}:3001/api/openclaw`
  : "http://localhost:3001/api/openclaw";

const POLL_INTERVAL_MS = 5000;

interface MessageEntry {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  loading?: boolean;
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function OpenClawControl() {
  const [gatewayReachable, setGatewayReachable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      setGatewayReachable(res.ok);
    } catch {
      setGatewayReachable(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
    const id = setInterval(checkStatus, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [checkStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: MessageEntry = {
      id: uid(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const agentMsgId = uid();
    const agentMsg: MessageEntry = {
      id: agentMsgId,
      role: "agent",
      content: "",
      timestamp: new Date(),
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionKey: "agent:main:main" }),
      });

      const data = await res.json() as { reply?: string; error?: string };

      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? { ...m, content: data.reply ?? data.error ?? "No response", loading: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? { ...m, content: err instanceof Error ? err.message : "Request failed", loading: false }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-3">
        <h1 className="text-lg font-semibold text-zinc-100">OpenClaw Control</h1>
      </header>

      {/* Status */}
      <section className="border-b border-zinc-800 px-4 py-2 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              gatewayReachable === null
                ? "bg-amber-500 animate-pulse"
                : gatewayReachable
                  ? "bg-emerald-500"
                  : "bg-red-500"
            }`}
          />
          <span className="text-zinc-400">
            {gatewayReachable === null
              ? "Checking..."
              : gatewayReachable
                ? "Gateway reachable"
                : "Gateway unreachable"}
          </span>
        </div>
      </section>

      {/* Messages */}
      <section className="flex-1 overflow-auto p-4 font-mono text-sm">
        {messages.length === 0 ? (
          <p className="text-zinc-500">No messages yet. Type below to send.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded px-3 py-2 ${
                  msg.role === "user"
                    ? "ml-4 bg-blue-900/40 text-blue-100"
                    : "mr-4 bg-zinc-800/80 text-zinc-200"
                }`}
              >
                <span className="text-zinc-500 text-xs">
                  {msg.role === "user" ? "You" : "Ash"} ·{" "}
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-sm break-words">
                  {msg.loading ? (
                    <span className="text-zinc-500 animate-pulse">thinking...</span>
                  ) : (
                    msg.content || "(no reply)"
                  )}
                </pre>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </section>

      {/* Input */}
      <footer className="border-t border-zinc-800 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded bg-blue-600 px-4 py-2 font-mono text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}
