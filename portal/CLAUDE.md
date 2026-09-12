# portal/ — Admin Dashboard

See root `CLAUDE.md` for full project context and architecture.

## Purpose

Internal admin tool. Not public-facing.

- Create, edit, schedule daily questions
- Moderate user-generated questions (approve/reject)
- View vote counts and basic analytics
- Manage categories

## Stack

- React + Vite
- TypeScript
- Supabase JS SDK (uses service role key — admin only)

## Design

Follows the shared design system defined in root `CLAUDE.md` — same tokens, same rules.

- **Font:** `Inter` (Google Fonts)
- Portal is internal but still uses the same clean minimal style
- White background, black text, Rose `#f43f5e` for active/accent states
- Tables and data-heavy views: use `#f5f5f5` row stripes, `#f0f0f0` borders
- Status badges: approved = `#10b981` (green), rejected = `#f43f5e` (rose), pending = `#f97316` (orange)

## Pages

```
/                  Dashboard — vote counts, DAU, today's question
/questions         List all questions — filter by status/category
/questions/new     Create new question
/questions/:id     Edit question, set as daily, change status
/moderation        User-generated questions pending review
/categories        Manage categories
/analytics         Basic stats (votes per day, top questions)
```

## Auth

- Portal uses a separate Supabase admin auth — not the same as app users
- Only users with `role = 'admin'` in profiles can access
- Protect every route with admin check

## Key Rules

- This is internal — prioritize function over form
- Use Supabase service role key (stored in `.env`, never committed)
- Always confirm before bulk deleting questions
- Question moderation: show question text + creator info, approve/reject buttons
- Approved questions go to `moderation_status = 'approved'`, rejected to `'rejected'`

## Running

```bash
cd portal
cp .env.example .env   # fill in Supabase URL + service role key
npm install
npm run dev
```
