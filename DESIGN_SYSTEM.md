# Design System — What Would You Pick?

**Style:** Editorial Minimal
**Applies to:** mobile app + website + admin portal

---

## Colors

| Name | Hex | Where |
|------|-----|-------|
| Primary (Rose) | `#f43f5e` | Active nav, dots, bars, CTAs, accent tags — max 1–2 per screen |
| Black | `#111111` | Headings, primary buttons, strong text |
| White | `#ffffff` | All backgrounds — always pure white |
| Gray 100 | `#f5f5f5` | Card bg, input bg, secondary surfaces |
| Gray 200 | `#f0f0f0` | Borders, dividers, progress tracks |
| Gray 400 | `#cccccc` | Inactive icons, placeholder text |
| Gray 600 | `#888888` | Supporting text, metadata |
| Orange | `#f97316` | Streak only — nowhere else |
| Green | `#10b981` | Approved status (portal only) |

---

## Typography

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Question / Page title | 20–22px | 700 | `#111111` |
| Card option text | 13–14px | 600 | `#333333` |
| Body text | 13–14px | 400 | `#888888` |
| Section label / tag | 10–11px | 700 | `#cccccc` or primary |
| Button text | 13px | 600 | depends on button type |
| Nav label | 9px | 600 | active `#111`, inactive `#cccccc` |

**Mobile:** System font (SF Pro Display / Roboto)
**Web + Portal:** `Inter` from Google Fonts

---

## Spacing

| Token | Value |
|-------|-------|
| Screen horizontal padding | 18–22px |
| Card padding | 20–22px |
| Section gap | 12–16px |
| Element gap (inside card) | 8–10px |

---

## Border Radius

| Element | Radius |
|---------|--------|
| Page cards | 18–20px |
| Buttons | 14–16px |
| Option buttons | 14–16px |
| Input fields | 12–14px |
| Pill tags | 999px |
| Small badges | 8px |

---

## Buttons

| Type | Background | Border | Text |
|------|-----------|--------|------|
| Primary | `#111111` | none | `#ffffff` |
| Secondary | `#f5f5f5` | `1.5px #f0f0f0` | `#555555` |
| Accent | `#f43f5e` | none | `#ffffff` — use rarely |
| Ghost | transparent | `1.5px #e8e8e8` | `#888888` |

---

## Component Patterns

### Question Card
- White background, `1px #f0f0f0` border, `20px` radius
- Question text: `22px / 700 / #111`
- Category label above: `11px / 500 / #cccccc`
- Options: `14px` radius, `#fafafa` bg, `1.5px #f0f0f0` border

### Option Button (before vote)
- Left: Large letter (A/B) `28px / 800 / #e8e8e8`
- Center: Option text `14px / 600 / #333`
- Right: Chevron `#dddddd`
- Hover: letter tints to primary-light

### Option Button (after vote)
- Picked: border turns `#111`, background tints lightly
- Bar: `3px` progress track fills with primary color
- Percentage: `20px / 800 / #111` appears right side

### Personality Card
- `#fafafa` bg, `1px #f0f0f0` border, `16px` radius
- Tag: `10px / 700` in primary color
- Title: `14px / 700 / #111`
- Progress bar: primary fill

### Bottom Nav
- White bg, `1px #f5f5f5` top border
- Active icon + label: `#111111`
- Inactive icon + label: `#cccccc`
- 4 items: Home · Explore · Create · Profile

---

## What Never to Do

- No gradients
- No heavy shadows (box-shadow with blur > 0px)
- No dark backgrounds
- No more than 2 accent-colored elements per screen
- No orange outside of streak
- No colorful text blocks
- No crowded layouts — whitespace is intentional
- No all-caps headings
- No decorative illustrations or icons as background elements
