# React Native App - Agent Instructions

Expo app with Expo Router (file-based routing) and NativeWind (Tailwind for RN).

## Key Directories

- `app/` — Expo Router file-based routes (like Next.js App Router)
- `app/(tabs)/` — Tab navigator screens
- `components/` — Reusable components
- `hooks/` — React Query hooks (same naming as web app: `use-auth.ts`, `use-voice-agent.ts`, `use-subscription.ts`)
- `lib/` — Feature flags and utilities (`dynamic.ts`, `dynamic-client.ts`, `elevenlabs.ts`, `features.ts`, `analytics.ts`)
- `assets/` — Images, fonts, static assets

## Rules

- Features implemented in `apps/web` must also be implemented here
- Use NativeWind `className` for styling (Tailwind syntax)
- Use React Query hooks in `hooks/` for all API calls (same names as web)
- File-based routing via Expo Router — create files in `app/` for new screens
- Use `FlatList`/`FlashList` for lists, never `.map()` in ScrollView
- Check `dynamicEnabled` before rendering auth UI. Use `useAuth()` for auth state.
- Wrap app with `DynamicWrapper` conditionally (same pattern as `StripeWrapper`)
- Check `elevenlabsEnabled` before rendering voice agent UI
- Wrap app with `ElevenLabsProvider` conditionally (same pattern as `StripeWrapper`)

## Component Mapping from Web

- shadcn `<Button>` → `<TouchableOpacity className="...">`
- shadcn `<Card>` → `<View className="...">`
- shadcn `<Input>` → `<TextInput className="...">`
- shadcn `<Dialog>` → React Native `<Modal>`

## Commands

```bash
pnpm --filter react-native dev   # Start Expo dev server
```
