const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export const elevenlabsEnabled = Boolean(agentId);

export const ELEVENLABS_AGENT_ID = agentId ?? "";
