import { dynamicEnabled } from "@/lib/dynamic";
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
  const { useReactiveClient } = require("@dynamic-labs/react-hooks");
  const { dynamicClient } = require("@/lib/dynamic-client");

  const { auth, user } = useReactiveClient(dynamicClient);

  if (!auth.isAuthenticated || !user) {
    return unauthenticatedState;
  }

  return {
    user: {
      id: user.userId,
      email: user.email,
    },
    isLoggedIn: true,
    getToken: async () => auth.token,
  };
}

function usePrivyAuth(): AuthState {
  const { usePrivy } = require("@privy-io/expo");
  const { user, isReady } = usePrivy();

  if (!isReady || !user) {
    return unauthenticatedState;
  }

  const email = user.linked_accounts?.find(
    (a: { type: string; address?: string }) => a.type === "email",
  )?.address;

  return {
    user: {
      id: user.id,
      email,
    },
    isLoggedIn: true,
    getToken: async () => {
      const { getAccessToken } = require("@privy-io/expo");
      return getAccessToken();
    },
  };
}

export function useAuth(): AuthState {
  if (dynamicEnabled) return useDynamicAuth(); // dynamic-auth-hook
  if (privyEnabled) return usePrivyAuth(); // privy-auth-hook
  return unauthenticatedState;
}
