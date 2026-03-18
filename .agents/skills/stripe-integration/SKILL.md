---
name: stripe-integration
description: Stripe payment integration patterns for this monorepo. Use when building, modifying, or reviewing any Stripe integration — including checkout flows, subscriptions, webhooks, PaymentSheet, or Customer Portal. Covers web (Next.js), React Native (Expo), and server (Fastify).
---

This skill guides Stripe integration in the Mastermind monorepo. It covers API selection, integration patterns for web and mobile, server routes, webhook handling, and testing.

## Integration Routing

| Building... | Recommended API | Package |
|---|---|---|
| Subscription checkout (web) | Checkout Sessions (hosted redirect) | `stripe` (server) |
| One-time payment (web) | Checkout Sessions + Payment Element | `@stripe/react-stripe-js` |
| Mobile payment (React Native) | PaymentSheet | `@stripe/stripe-react-native` |
| Subscription management | Customer Portal | `stripe` (server) |
| Saving payment method | Setup Intents | `stripe` (server) |

Always prefer Checkout Sessions over raw PaymentIntents unless the user explicitly needs low-level control.

## Web Integration Pattern (Next.js)

```typescript
// src/lib/stripe.ts — singleton loader with graceful fallback
import { loadStripe } from "@stripe/stripe-js";

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const stripeEnabled = Boolean(key);
export const getStripe = () => stripeEnabled ? loadStripe(key!) : Promise.resolve(null);
```

For subscriptions, redirect to Stripe-hosted Checkout:
1. Client calls `POST /api/stripe/create-checkout-session` with `priceId`
2. Server creates a Checkout Session with `mode: "subscription"`
3. Client redirects to `session.url`
4. After payment, user lands on `/pricing/success?session_id={CHECKOUT_SESSION_ID}`

For managing existing subscriptions, create a Customer Portal session via `POST /api/stripe/create-portal-session`.

## React Native Integration Pattern (Expo)

```typescript
// Wrap app in StripeProvider (conditionally)
import { StripeProvider } from "@stripe/stripe-react-native";

<StripeProvider publishableKey={key} merchantIdentifier="merchant.com.app" urlScheme="appscheme">
  {children}
</StripeProvider>
```

For payments, use PaymentSheet:
1. Client calls `POST /api/stripe/create-payment-intent` for `clientSecret`
2. Call `initPaymentSheet({ paymentIntentClientSecret, merchantDisplayName, returnURL })`
3. Call `presentPaymentSheet()` to open native payment UI
4. Handle result (success or error)

## Server Integration Pattern (Fastify)

- Initialize stripe conditionally: `const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null`
- Routes return `503` when stripe is null
- Webhook route uses `stripe.webhooks.constructEvent()` for signature verification
- Webhook events to handle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`

## Testing

- Test card: `4242 4242 4242 4242` (any future expiry, any CVC)
- 3DS test card: `4000 0025 0000 3155`
- Declined card: `4000 0000 0000 9995`
- Use Stripe CLI for local webhook forwarding: `stripe listen --forward-to localhost:3001/api/stripe/webhook`

## Key Documentation

- [Checkout Sessions](https://docs.stripe.com/payments/checkout)
- [Payment Element](https://docs.stripe.com/payments/payment-element)
- [Customer Portal](https://docs.stripe.com/customer-management)
- [Billing/Subscriptions](https://docs.stripe.com/billing/subscriptions/build-subscriptions)
- [Webhooks](https://docs.stripe.com/webhooks)
- [React Native SDK](https://docs.stripe.com/payments/accept-a-payment?platform=react-native)
