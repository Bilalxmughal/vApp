@AGENTS.md

# website/ — Next.js SEO Website

See root `CLAUDE.md` for full project context and architecture.

## Purpose

1. Rank questions on Google → bring organic traffic
2. Let website visitors vote → show results → CTA to download app
3. App download funnel: Google → question page → vote → download

## Stack

- Next.js 16 (App Router) — read AGENTS.md for breaking changes
- TypeScript
- Tailwind CSS v4
- Supabase JS SDK (service role key server-side only)

## Routes

```
/                          Homepage — today's question + popular questions + download CTA
/q/[slug]                  Individual question page (ISR, revalidate: 3600)
/[category]                Category page — money, travel, food, etc.
/questions                 Browse all questions
/about
/privacy
/terms
/sitemap.xml               Dynamic sitemap — all active questions + category pages
/robots.txt
```

## SEO Requirements (every page)

- Unique `<title>` and `<meta name="description">`
- Canonical URL
- Open Graph tags (og:title, og:description, og:image)
- Twitter card tags
- Schema.org structured data (Question schema on question pages)
- Fast loading — no blocking JS for above-fold content
- Mobile-first

## Question Page Flow

1. User lands from Google
2. Sees question + A/B options
3. Votes (stored in Supabase, one vote per IP/session)
4. Sees results + percentage
5. Sees "People Like You" if enough data
6. CTA: "Get daily questions + personality insights → Download app"

## Design

Follows the shared design system defined in root `CLAUDE.md` — same tokens, same rules.

- **Font:** `Inter` (Google Fonts) — closest web equivalent to SF Pro Display
- **Tailwind config:** map design tokens to Tailwind custom colors
- Mobile-first responsive
- No dark mode on website — always light (white background)
- Question cards on website must look identical to mobile cards in spirit

### Tailwind Token Mapping

```js
// tailwind.config.js
colors: {
  primary: '#f43f5e',
  black: '#111111',
  gray: {
    100: '#f5f5f5',
    200: '#f0f0f0',
    400: '#cccccc',
    600: '#888888',
  },
  orange: '#f97316',
}
```

## Key Rules

- `SUPABASE_SERVICE_ROLE_KEY` only in Server Components / API routes — never in client
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side
- ISR for question pages: `revalidate: 3600` (vote counts update hourly)
- Static generation for category/info pages
- Sitemap must include all `status = 'active'` questions
- Never expose vote manipulation — server-side vote validation only
