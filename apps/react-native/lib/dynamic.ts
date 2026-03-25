const environmentId = process.env.EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

export const dynamicEnabled = Boolean(environmentId);

export const DYNAMIC_ENVIRONMENT_ID = environmentId ?? "";
