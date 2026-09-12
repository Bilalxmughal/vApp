# vApp - Daily Social Voting App

Monorepo with three sub-projects:

| Folder | Stack | Purpose |
|--------|-------|---------|
| `portal/` | React + Vite + Supabase | Admin/Internal portal |
| `website/` | Next.js + Tailwind + Supabase | Business/public website |
| `mobile/` | React Native (Expo) + Supabase | Mobile app |

## Setup

Each project has its own `.env` file. Copy `.env.example` to `.env` and fill in your Supabase credentials.

```bash
# Portal
cd portal && cp .env.example .env && npm install && npm run dev

# Website
cd website && cp .env.example .env && npm run dev

# Mobile
cd mobile && cp .env.example .env && npx expo start
```

## Supabase
- All three projects share the same Supabase project
- `portal` and `mobile` use anon key only
- `website` may use service role key for server-side operations (never expose in client)
