import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useVoiceAgent } from "@/hooks/use-voice-agent";

export default function VoiceAgentScreen() {
  const { t } = useTranslation();
  const {
    enabled,
    status,
    isSpeaking,
    canSendFeedback,
    messages,
    start,
    stop,
    sendFeedback,
  } = useVoiceAgent();

  if (!enabled) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <Text className="mb-2 text-center text-lg font-semibold text-zinc-900">
          {t("voiceAgentNotConfigured")}
        </Text>
        <Text className="text-center text-sm text-zinc-500">
          {t("voiceAgentNotConfiguredHint")}
        </Text>
      </View>
    );
  }

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isDisconnected = status === "disconnected";

  const statusLabel = isConnected
    ? isSpeaking
      ? t("voiceAgentSpeaking")
      : t("voiceAgentListening")
    : isConnecting
      ? t("voiceAgentConnecting")
      : t("voiceAgentDisconnected");

  const orbColor = isConnected
    ? isSpeaking
      ? "bg-emerald-500"
      : "bg-emerald-400"
    : isConnecting
      ? "bg-amber-400"
      : "bg-zinc-200";

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="items-center px-6 pb-12 pt-8"
      >
        {/* Header */}
        <Text className="mb-1 text-2xl font-bold text-zinc-900">
          {t("voiceAgent")}
        </Text>
        <Text className="mb-8 text-sm text-zinc-500">
          {t("voiceAgentDescription")}
        </Text>

        {/* Orb */}
        <View
          className={`mb-6 h-32 w-32 items-center justify-center rounded-full ${orbColor}`}
        >
          <Text className={`text-3xl ${isConnected || isConnecting ? "text-white" : "text-zinc-400"}`}>
            {isConnected && isSpeaking ? "🔊" : "🎙️"}
          </Text>
        </View>

        {/* Status */}
        <View className="mb-6 flex-row items-center gap-2">
          <View
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected
                ? "bg-emerald-500"
                : isConnecting
                  ? "bg-amber-400"
                  : "bg-zinc-400"
            }`}
          />
          <Text className="text-sm font-medium text-zinc-600">
            {statusLabel}
          </Text>
        </View>

        {/* Action Button */}
        {isDisconnected ? (
          <TouchableOpacity
            onPress={start}
            className="rounded-full bg-zinc-900 px-10 py-3.5"
          >
            <Text className="text-sm font-semibold text-white">
              {t("voiceAgentStart")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stop}
            disabled={isConnecting}
            className="rounded-full border border-zinc-300 bg-white px-10 py-3.5"
          >
            <Text className="text-sm font-semibold text-zinc-900">
              {t("voiceAgentStop")}
            </Text>
          </TouchableOpacity>
        )}

        {/* Feedback */}
        {canSendFeedback && (
          <View className="mt-4 flex-row gap-3">
            <TouchableOpacity
              onPress={() => sendFeedback(true)}
              className="rounded-full bg-emerald-50 p-3"
            >
              <Text className="text-lg">👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendFeedback(false)}
              className="rounded-full bg-red-50 p-3"
            >
              <Text className="text-lg">👎</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transcript */}
        {messages.length > 0 && (
          <View className="mt-8 w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <Text className="mb-3 text-sm font-semibold text-zinc-700">
              {t("voiceAgentTranscript")}
            </Text>
            {messages.map((msg, i) => (
              <View
                key={i}
                className={`mb-2 max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.source === "user"
                    ? "self-end bg-zinc-900"
                    : "self-start bg-white"
                }`}
              >
                <Text
                  className={`text-sm ${
                    msg.source === "user" ? "text-white" : "text-zinc-800"
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
