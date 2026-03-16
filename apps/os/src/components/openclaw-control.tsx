"use client";

import { useState, useEffect, useCallback } from "react";
import { appConfig } from "@repo/app-config";

const API_BASE = `${appConfig.urls.api}/api/openclaw`;
const POLL_INTERVAL_MS = 5000;

interface MessageEntry {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

export function OpenClawControl() {
  const [gatewayReachable, setGatewayReachable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

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

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: MessageEntry = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };

      if (res.ok && data.reply) {
        const agentMsg: MessageEntry = {
          id: crypto.randomUUID(),
          role: "agent",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        const errMsg: MessageEntry = {
          id: crypto.randomUUID(),
          role: "agent",
          content: data.error ?? `Error ${res.status}: ${res.statusText}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (err) {
      const agentMsg: MessageEntry = {
        id: crypto.randomUUID(),
        role: "agent",
        content: err instanceof Error ? err.message : "Failed to send message",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
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
            aria-hidden
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
                  {msg.role === "user" ? "You" : "Agent"} ·{" "}
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-sm wrap-break-word">
                  {msg.content}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Input */}
      <footer className="border-t border-zinc-800 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
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
