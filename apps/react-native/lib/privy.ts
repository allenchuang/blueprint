const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
const clientId = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;

export const privyEnabled = Boolean(appId);

export const PRIVY_APP_ID = appId ?? "";
export const PRIVY_CLIENT_ID = clientId ?? "";
