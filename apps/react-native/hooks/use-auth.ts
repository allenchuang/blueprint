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
    getToken: () => auth.token,
  };
}

export function useAuth(): AuthState {
  if (!dynamicEnabled) return unauthenticatedState;
  return useDynamicAuth();
}
