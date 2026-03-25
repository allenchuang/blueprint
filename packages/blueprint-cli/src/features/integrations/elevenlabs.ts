import type { FeatureManifest } from "../index.js";

export const elevenlabsManifest: FeatureManifest = {
  id: "elevenlabs",
  name: "ElevenLabs Voice Agent",
  description: "Real-time AI voice conversations",
  category: "integration",
  cliFlag: "--with-elevenlabs",
  filesToRemove: [
    "apps/web/src/lib/elevenlabs.ts",
    "apps/web/src/hooks/use-voice-agent.ts",
    // RN files
    "apps/react-native/lib/elevenlabs.ts",
    "apps/react-native/hooks/use-voice-agent.ts",
    "apps/react-native/app/(tabs)/voice-agent.tsx",
  ],
  dirsToRemove: ["apps/web/src/app/voice-agent"],
  depsToRemove: {
    "apps/web": ["@elevenlabs/react"],
    "apps/react-native": ["@elevenlabs/react-native"],
  },
  layoutPatches: [
    {
      file: "apps/web/src/components/nav-bar.tsx",
      type: "remove-line",
      match: 'href: "/voice-agent"',
    },
    {
      file: "apps/web/src/components/nav-bar.tsx",
      type: "remove-line",
      match: "elevenlabs-nav-icon",
    },
    {
      file: "apps/web/src/components/nav-sidebar.tsx",
      type: "remove-block",
      match: 'href: "/voice-agent"',
    },
    {
      file: "apps/web/src/components/nav-sidebar.tsx",
      type: "remove-line",
      match: "elevenlabs-nav-icon",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-import",
      match: "elevenlabsEnabled",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-block",
      match: "function ElevenLabsWrapper",
    },
    {
      file: "apps/react-native/app/_layout.tsx",
      type: "remove-wrapper",
      match: "ElevenLabsWrapper",
    },
    {
      file: "apps/react-native/app/(tabs)/_layout.tsx",
      type: "remove-block",
      match: 'name="voice-agent"',
    },
  ],
  envKeysToRemove: [
    "NEXT_PUBLIC_ELEVENLABS_AGENT_ID",
    "EXPO_PUBLIC_ELEVENLABS_AGENT_ID",
  ],
  i18nKeysToRemove: [
    "elevenlabsVoice",
    "voiceAgent",
    "voiceAgentDescription",
    "voiceAgentStart",
    "voiceAgentStop",
    "voiceAgentListening",
    "voiceAgentSpeaking",
    "voiceAgentConnecting",
    "voiceAgentDisconnected",
    "voiceAgentMicPermission",
    "voiceAgentMicBlocked",
    "voiceAgentNotConfigured",
    "voiceAgentNotConfiguredHint",
    "voiceAgentFeedbackPositive",
    "voiceAgentFeedbackNegative",
    "voiceAgentMute",
    "voiceAgentUnmute",
    "voiceAgentTranscript",
  ],
  ruleFilesToRemove: ["019-elevenlabs-voice-agent.mdc"],
  skillDirsToRemove: [],
  rootScriptsToRemove: [],
  turboTasksToRemove: [],
  dependsOnRN: true,
};
