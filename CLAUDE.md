# vApp — What Would You Pick?

Daily social voting app. User ek question dekhta hai, A ya B choose karta hai, live results aur personality insights milti hain.

**Tagline:** "Pick yours. See what the world thinks."
**Target:** USA primary, worldwide available.

---

## Monorepo Structure

| Folder | Stack | Purpose |
|--------|-------|---------|
| `mobile/` | React Native + Expo 52 + TypeScript | iOS + Android app |
| `website/` | Next.js 16 + Tailwind v4 + TypeScript | SEO website + app download funnel |
| `portal/` | React + Vite + TypeScript | Admin dashboard |
| `supabase/` | SQL migrations + Edge Functions | Backend schema + logic |

All three share the same Supabase project.

---

## Tech Stack

- **Backend:** Supabase (Postgres + Auth + Realtime + Edge Functions + RLS)
- **Mobile state:** Zustand
- **Subscriptions:** RevenueCat (iOS + Android billing)
- **Ads:** react-native-google-mobile-ads (AdMob)
- **Language:** TypeScript everywhere

---

## Design System — Applies to ALL Platforms (mobile, website, portal)

One consistent design language across every surface. If it looks different on website vs app, it's wrong.

### Core Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#f43f5e` | Accent elements — active nav, dots, progress bars, CTAs, tags |
| Black | `#111111` | Primary text, primary buttons, bold headings |
| White | `#ffffff` | Page/screen background — always pure white |
| Gray 100 | `#f5f5f5` | Card backgrounds, input fields, secondary surfaces |
| Gray 200 | `#f0f0f0` | Borders, dividers, progress track backgrounds |
| Gray 400 | `#cccccc` | Inactive icons, placeholder text |
| Gray 600 | `#888888` | Secondary/supporting text |
| Orange | `#f97316` | Streak only — do not use elsewhere |

### Typography

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Question / Heading | 20–22px | 700 | `#111111` |
| Option text | 13–14px | 600 | `#333333` |
| Body / supporting | 13–14px | 400 | `#888888` |
| Labels / tags | 10–11px | 700 | primary or muted |
| Nav labels | 9px | 600 | active: `#111`, inactive: `#cccccc` |

**Mobile font:** System font (SF Pro Display on iOS, Roboto on Android)
**Web font:** `Inter` via Google Fonts (closest to SF Pro for web)
**Portal font:** `Inter` same as website

### Spacing & Radius

- Card border radius: `16–20px`
- Button border radius: `14–16px`
- Pill border radius: `999px`
- Card padding: `20–22px`
- Section gap: `12–16px`
- Screen horizontal padding: `18–22px`

### Rules — Never Break These

- No gradients anywhere
- No heavy drop shadows (borders only, max `1.5px solid #f0f0f0`)
- No dark backgrounds (screens are always white)
- No more than 2 accent colors visible at once (primary + black)
- Orange (`#f97316`) only for streak — nowhere else
- Primary (`#f43f5e`) used sparingly — 1–2 elements per screen max
- All text on white — never colored text blocks
- Whitespace is intentional — never cram elements

---

## Architecture Decisions

### Voting
- `votes` table: `UNIQUE(question_id, user_id)` prevents duplicate votes at DB level
- Optimistic UI: show result immediately on tap, confirm async
- `vote_count_a/b` cached on `questions` table via Postgres trigger — never COUNT(*) at display time
- Guest users: device fingerprint as `guest_id` with same unique constraint

### Auth
- Supabase Auth: Email/Password + Google OAuth + Apple Sign In (required for iOS)
- Guest mode: anonymous voting without account
- Session stored in AsyncStorage on mobile

### Subscriptions
- RevenueCat is source of truth
- `is_premium` on `profiles` is a cached flag updated via RevenueCat webhook → Edge Function
- Never hardcode pricing — configured in App Store Connect / Google Play Console

### Ads
- AdMob via `react-native-google-mobile-ads`
- Always check `isPremium` before showing any ad
- Interstitial: every 5th question answered
- Banner: bottom of Explore screen only

---

## Database Tables (summary)

- `profiles` — extends auth.users, has streak/premium/total_votes
- `questions` — question text, option_a/b, category, cached vote counts, moderation_status
- `categories` — slug, emoji, order
- `votes` — question_id + user_id/guest_id + choice, unique constraint
- `question_personality_tags` — maps choices to personality tags with weights
- `subscriptions` — RevenueCat synced subscription status
- `notification_tokens` — Expo push tokens

---

## Development Phases

- **Phase 0** — TypeScript migration + DB schema + seed data (500+ questions) + Auth ✅/🔄
- **Phase 1** — Navigation + Home + Voting + Results + Explore + Basic Profile
- **Phase 2** — Daily question + Streak + Sharing + User-created questions + Portal
- **Phase 3** — RevenueCat + AdMob + Personality Insights + People Like You
- **Phase 4** — Next.js SEO pages + Question pages + Website voting + App funnel

---

## Code Rules

- TypeScript strict mode — no `any`
- Business logic separate from UI (hooks + stores, not inside screens)
- Reusable components in `components/` — never duplicate UI
- Environment variables only — never hardcode keys or URLs
- One vote per user per question — enforced at DB level, not just client
- Check `isPremium` before any premium feature or ad
- Comments only when WHY is non-obvious
- No unnecessary abstractions — MVP first

---

## Environment Variables

Each sub-project has its own `.env` (copy from `.env.example`).

Mobile uses `EXPO_PUBLIC_` prefix for client-safe vars.
Website uses `NEXT_PUBLIC_` prefix for client-safe vars.
Never expose `SUPABASE_SERVICE_ROLE_KEY` on client side.
