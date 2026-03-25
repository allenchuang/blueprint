"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { dynamicEnabled, DYNAMIC_ENVIRONMENT_ID } from "@/lib/dynamic";
import type { ReactNode } from "react";

export function DynamicAuthProvider({ children }: { children: ReactNode }) {
  if (!dynamicEnabled) return <>{children}</>;

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
