# Blueprint Integrations Reference

> When working in a Blueprint repo, the `.claude/rules/*.mdc` files are authoritative.
> This file provides ecosystem-level integration context.

## Authentication

Two mutually exclusive auth providers, chosen during CLI scaffolding.

### Dynamic Auth (Email OTP)

- **Web**: `DynamicContextProvider` from `@dynamic-labs/sdk-react-core`
- **React Native**: `createClient` from `@dynamic-labs/client` + `ReactNativeExtension`
- **Server**: JWT via JWKS (RS256), upserts via `dynamic_user_id`
- **Env**: `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID`, `EXPO_PUBLIC_DYNAMIC_ENVIRONMENT_ID`, `DYNAMIC_ENVIRONMENT_ID`
- Feature flag: `dynamicEnabled` in `lib/dynamic.ts`

### Privy Auth (Email, Social, Wallets)

- **Web**: `PrivyProvider` from `@privy-io/react-auth`
- **React Native**: `PrivyProvider` from `@privy-io/expo`
- **Server**: JWT via `@privy-io/node` (ES256), upserts via `privy_user_id`
- **Env**: `NEXT_PUBLIC_PRIVY_APP_ID`, `EXPO_PUBLIC_PRIVY_APP_ID`, `PRIVY_APP_ID` + `PRIVY_APP_SECRET`
- Feature flag: `privyEnabled` in `lib/privy.ts`

Both expose `useAuth()`: `{ user, isLoggedIn, getToken }`. Send JWT as `Authorization: Bearer <token>`. Never use NextAuth, Clerk, or other auth libs.

## Stripe Payments

- **Web**: `@stripe/react-stripe-js` + `@stripe/stripe-js` (Checkout Sessions)
- **React Native**: `@stripe/stripe-react-native` (PaymentSheet)
- **Server**: `stripe` Node SDK in `apps/server/src/routes/stripe.ts`
- Feature flag: `stripeEnabled` — when unconfigured, all features unlocked

### Feature Gating

Tiers in `lib/features.ts`: `free` (default), `pro` (paid). Use `hasFeature(tier, key)` and `useSubscription()` hook. Always enforce server-side.

## World Mini App (MiniKit)

Runs inside World App webview. Guard with `MiniKit.isInstalled()`. Backend verification at `src/app/api/minikit/`. Auth via Wallet Auth (SIWE). Display `MiniKit.user.username`, not raw addresses.

- Payments: WLD/USDC on World Chain, minimum $0.1, whitelist recipients in Developer Portal
- Design: 24px padding, `100dvh`, bottom tab navigation only, no `alert()`/`confirm()`

## ElevenLabs Voice Agent

- **Web**: `@elevenlabs/react` — `useConversation`
- **React Native**: `@elevenlabs/react-native` — `ElevenLabsProvider` + `useConversation`
- Feature flag: `elevenlabsEnabled` in `lib/elevenlabs.ts`
- Use `useVoiceAgent()` wrapper. Check flag before rendering voice UI.
