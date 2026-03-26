"use client";

import { useDynamicContext, useIsLoggedIn, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { dynamicEnabled } from "@/lib/dynamic";
import { usePrivy } from "@privy-io/react-auth";
import { privyEnabled } from "@/lib/privy";

interface AuthUser {
  id: string;
  email: string | undefined;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  getToken: () => Promise<string | null | undefined>;
}

const unauthenticatedState: AuthState = {
  user: null,
  isLoggedIn: false,
  getToken: async () => undefined,
};

function useDynamicAuth(): AuthState {
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn || !user) {
    return unauthenticatedState;
  }

  return {
    user: {
      id: user.userId ?? "",
      email: user.email,
    },
    isLoggedIn: true,
    getToken: async () => getAuthToken(),
  };
}

function usePrivyAuth(): AuthState {
  const privy = usePrivy();

  if (!privy.authenticated || !privy.user) {
    return unauthenticatedState;
  }

  const email =
    privy.user.email?.address ??
    privy.user.google?.email ??
    privy.user.apple?.email;

  return {
    user: {
      id: privy.user.id,
      email,
    },
    isLoggedIn: true,
    getToken: () => privy.getAccessToken(),
  };
}

export function useAuth(): AuthState {
  if (dynamicEnabled) return useDynamicAuth(); // dynamic-auth-hook
  if (privyEnabled) return usePrivyAuth(); // privy-auth-hook
  return unauthenticatedState;
}
