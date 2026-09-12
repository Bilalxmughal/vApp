# mobile/ — React Native App

See root `CLAUDE.md` for full project context and architecture.

## Stack

- React Native + Expo SDK 52
- TypeScript (strict)
- React Navigation v7 (Native Stack + Bottom Tabs)
- Zustand (state management)
- Supabase JS SDK
- RevenueCat (subscriptions)
- react-native-google-mobile-ads (AdMob)

## Folder Structure

```
src/
  components/
    common/       # Button, Card, Avatar, Badge — reusable everywhere
    question/     # QuestionCard, OptionButton, ResultBar, ShareCard
    profile/      # StreakBadge, PersonalityBar
  screens/
    auth/         # WelcomeScreen, SignInScreen, SignUpScreen
    home/         # HomeScreen
    explore/      # ExploreScreen, CategoryScreen
    create/       # CreateQuestionScreen
    profile/      # ProfileScreen, SettingsScreen
  navigation/
    AppNavigator.tsx    # Root: AuthNavigator vs TabNavigator
    AuthNavigator.tsx
    TabNavigator.tsx    # Home | Explore | Create | Profile
  lib/
    supabase.ts         # Supabase client
    revenuecat.ts       # RevenueCat setup
  store/
    authStore.ts        # user, session, isPremium, isGuest
    questionStore.ts    # daily question, answers cache
  hooks/
    useVote.ts          # voting logic + optimistic update
    useStreak.ts        # streak tracking
    useQuestions.ts     # fetch questions by category
  types/
    index.ts            # all shared TypeScript types
  utils/
    personality.ts      # calculate personality scores from vote history
```

## Design Tokens (use these everywhere)

```ts
export const colors = {
  primary: '#f43f5e',    // Rose — main accent
  black: '#111111',      // Text, buttons
  white: '#ffffff',      // Background
  gray100: '#f5f5f5',   // Light surfaces
  gray200: '#f0f0f0',   // Borders
  gray400: '#cccccc',   // Muted text/icons
  gray600: '#888888',   // Secondary text
  orange: '#f97316',    // Streak, warnings
}

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 999,
}
```

## Key Rules

- Optimistic voting: update UI immediately, then sync to Supabase
- Always check `authStore.isPremium` before showing ads or premium features
- Guest users get `isGuest: true` in authStore — gate streak/profile features
- All Supabase queries go through hooks, never directly in screens
- Expo env vars must use `EXPO_PUBLIC_` prefix

## Running

```bash
cd mobile
cp .env.example .env   # fill in Supabase URL + anon key
npx expo start
```
