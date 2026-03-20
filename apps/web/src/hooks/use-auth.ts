"use client";

import { useDynamicContext, useIsLoggedIn, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { dynamicEnabled } from "@/lib/dynamic";

interface AuthUser {
  id: string;
  email: string | undefined;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  getToken: () => string | undefined;
}

const unauthenticatedState: AuthState = {
  user: null,
  isLoggedIn: false,
  getToken: () => undefined,
};

export function useAuth(): AuthState {
  if (!dynamicEnabled) return unauthenticatedState;

  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn || !user) {
    return unauthenticatedState;
  }

  return {
    user: {
      id: user.userId,
      email: user.email,
    },
    isLoggedIn: true,
    getToken: () => getAuthToken(),
  };
}
