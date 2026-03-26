"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { ComposeClient } from "./compose-client";

// Wrapper that reads the ?trend= query param and pre-fills the composer
function ComposeWithTrendInner() {
  const searchParams = useSearchParams();
  const trend = searchParams.get("trend");

  // We pass the trend as a prop so ComposeClient can pre-fill
  return <ComposeClient initialTrend={trend ?? undefined} />;
}

export function ComposeWithTrend() {
  return (
    <Suspense fallback={<ComposeClient />}>
      <ComposeWithTrendInner />
    </Suspense>
  );
}
