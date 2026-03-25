# React Native App

Mobile application for Blueprint built with Expo and Expo Router. Uses NativeWind for Tailwind CSS-style styling on React Native.

## Tech Stack

- **Expo** (SDK 52) with New Architecture enabled
- **Expo Router** for file-based navigation (consistent with Next.js)
- **NativeWind v4** (Tailwind CSS for React Native)
- **React Query** for server state management
- **React Native Reanimated** for animations

## Development

```bash
# From monorepo root
pnpm --filter react-native dev

# Or directly
cd apps/react-native && npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## Directory Structure

```
apps/react-native/
├── app/
│   ├── _layout.tsx         → Root layout with QueryClientProvider
│   └── (tabs)/
│       ├── _layout.tsx     → Tab navigator
│       ├── index.tsx       → Home tab
│       └── settings.tsx    → Settings tab
├── components/             → Reusable components
├── hooks/                  → React Query hooks for API calls
├── assets/                 → Images, fonts, and other static assets
├── global.css              → NativeWind/Tailwind entry point
├── tailwind.config.js      → Tailwind configuration
├── metro.config.js         → Metro bundler config (monorepo + NativeWind)
├── babel.config.js         → Babel config (NativeWind preset)
└── app.json                → Expo configuration
```

## Patterns

- **File-based routing** via Expo Router — same mental model as Next.js App Router
- **NativeWind** for styling — use `className` props just like web Tailwind
- **React Query hooks** in `hooks/` for all API calls
- **Monorepo-aware Metro** — `metro.config.js` is configured to resolve packages from the monorepo root

## Co-development with Web

When building features, implement them in both `apps/web` and `apps/react-native` simultaneously:
- Web uses shadcn/ui components; RN uses NativeWind equivalents
- Same hook naming conventions across both (`useGetUsers`, `useCreatePost`)
- Same page/screen structure where applicable

## Build

```bash
# EAS Build (production)
cd apps/react-native
npx eas build --platform ios
npx eas build --platform android
```
