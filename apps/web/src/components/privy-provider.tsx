"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { privyEnabled, PRIVY_APP_ID, PRIVY_CLIENT_ID } from "@/lib/privy";
import type { ReactNode } from "react";

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  if (!privyEnabled) return <>{children}</>;

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID || undefined}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
