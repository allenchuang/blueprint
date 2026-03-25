const agentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

export const elevenlabsEnabled = Boolean(agentId);

export const ELEVENLABS_AGENT_ID = agentId ?? "";
