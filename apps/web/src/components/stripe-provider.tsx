"use client";

import type { ReactNode } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe, stripeEnabled } from "@/lib/stripe";

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  if (!stripeEnabled) {
    return <>{children}</>;
  }

  return <Elements stripe={getStripe()}>{children}</Elements>;
}
