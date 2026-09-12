# supabase/ — Database & Backend

See root `CLAUDE.md` for full project context and architecture.

## Structure

```
supabase/
  migrations/          SQL migration files — run in order
  functions/           Supabase Edge Functions (Deno)
    vote/              Handle vote submission + streak update
    daily-question/    Cron: auto-set today's daily question
    revenuecat-webhook/ Sync subscription status from RevenueCat
  seed.sql             500+ initial questions with categories
```

## Migration Naming

`YYYYMMDD_description.sql` — e.g. `20260913_initial_schema.sql`

Always create new migration files. Never edit existing ones.

## Key Tables

- `profiles` — user profile, streak, is_premium
- `questions` — all questions, cached vote counts, moderation_status
- `categories` — question categories with emoji + slug
- `votes` — one row per user+question, unique constraint prevents duplicates
- `question_personality_tags` — personality tag mappings per question choice
- `subscriptions` — RevenueCat synced data
- `notification_tokens` — Expo push tokens

## RLS Rules (important)

- `votes`: users can only INSERT, not UPDATE/DELETE. One row per (question_id, user_id).
- `profiles`: users can only read/update their own row.
- `questions`: anyone can read active questions. Only admin can insert/update.
- `categories`: public read. Admin write only.

## Edge Function: vote

Called when user submits a vote. Does:
1. Insert into `votes` (will fail if duplicate — return 409)
2. Increment `vote_count_a` or `vote_count_b` on `questions`
3. Update `streak_current` and `streak_last_date` on `profiles`
4. Return updated percentages

## Edge Function: daily-question

Runs via cron at midnight UTC. Does:
1. Find question with `daily_date = today` in `questions`
2. If none scheduled, picks highest engagement_score unanswered active question
3. Sets `is_daily = true` for today's question
