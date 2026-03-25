import { loadStripe, type Stripe } from "@stripe/stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const stripeEnabled = Boolean(stripePublishableKey);

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripeEnabled) return Promise.resolve(null);
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey!);
  }
  return stripePromise;
}
