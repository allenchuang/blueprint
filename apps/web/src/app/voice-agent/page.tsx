"use client";

import { useTranslation } from "react-i18next";
import { useVoiceAgent } from "@/hooks/use-voice-agent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StatusDot({ status }: { status: string }) {
  const color =
    status === "connected"
      ? "bg-emerald-500"
      : status === "connecting"
        ? "bg-amber-400"
        : "bg-zinc-400";

  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === "connected" && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`}
        />
      )}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  );
}

export default function VoiceAgentPage() {
  const { t } = useTranslation();
  const {
    enabled,
    status,
    isSpeaking,
    canSendFeedback,
    micPermission,
    messages,
    start,
    stop,
    sendFeedback,
    requestMicPermission,
  } = useVoiceAgent();

  if (!enabled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <svg
              className="h-8 w-8 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">
            {t("voiceAgentNotConfigured")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {t("voiceAgentNotConfiguredHint")}
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="outline">{t("backToHome")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isDisconnected = status === "disconnected";

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {t("voiceAgent")}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {t("voiceAgentDescription")}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              {t("backToHome")}
            </Button>
          </Link>
        </div>

        {/* Agent Orb + Controls */}
        <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 md:p-12">
          {/* Orb */}
          <div className="relative mb-8">
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full transition-all duration-500 ${
                isConnected
                  ? isSpeaking
                    ? "bg-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                    : "bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
                  : isConnecting
                    ? "bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                    : "bg-zinc-200"
              }`}
            >
              {isConnected && isSpeaking ? (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 animate-pulse rounded-full bg-white"
                      style={{
                        height: `${12 + Math.random() * 20}px`,
                        animationDelay: `${i * 150}ms`,
                        animationDuration: "0.6s",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <svg
                  className={`h-12 w-12 ${isConnected || isConnecting ? "text-white" : "text-zinc-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </div>
            {isConnected && isSpeaking && (
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
            )}
          </div>

          {/* Status */}
          <div className="mb-6 flex items-center gap-2">
            <StatusDot status={status} />
            <span className="text-sm font-medium text-zinc-600">
              {isConnected
                ? isSpeaking
                  ? t("voiceAgentSpeaking")
                  : t("voiceAgentListening")
                : isConnecting
                  ? t("voiceAgentConnecting")
                  : t("voiceAgentDisconnected")}
            </span>
          </div>

          {/* Mic Permission Warning */}
          {micPermission === "denied" && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
              {t("voiceAgentMicBlocked")}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isDisconnected ? (
              <Button
                onClick={start}
                className="rounded-full px-8"
                disabled={micPermission === "denied"}
              >
                {t("voiceAgentStart")}
              </Button>
            ) : (
              <Button
                onClick={stop}
                variant="outline"
                className="rounded-full px-8"
                disabled={isConnecting}
              >
                {t("voiceAgentStop")}
              </Button>
            )}
          </div>

          {/* Feedback */}
          {canSendFeedback && (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => sendFeedback(true)}
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                title={t("voiceAgentFeedbackPositive")}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.464 4.167 9.75 5.904 9.75v9z"
                  />
                </svg>
              </button>
              <button
                onClick={() => sendFeedback(false)}
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title={t("voiceAgentFeedbackNegative")}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-4.929c-.483 0-.964.078-1.423.23l-3.114 1.04a4.501 4.501 0 01-1.423.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.464 4.167 9.75 5.904 9.75v9z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Transcript */}
        {messages.length > 0 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-zinc-700">
                {t("voiceAgentTranscript")}
              </h2>
            </div>
            <div className="max-h-80 overflow-y-auto p-5">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.source === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.source === "user"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
