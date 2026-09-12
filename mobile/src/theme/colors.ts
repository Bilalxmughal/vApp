// Design system per CLAUDE.md — applies to all platforms
export const colors = {
  // Core
  primary: '#386ebd',       // Blue — CTAs, active nav, dots, progress
  primaryLight: '#f0f5fc',  // Primary 6% tint — section backgrounds
  primaryBorder: '#b8d0f0', // Primary 25% tint — section borders
  black: '#111111',         // Primary text, primary buttons, headings
  white: '#ffffff',         // All screen backgrounds — always white

  // Grays
  gray100: '#f5f5f5',       // Card backgrounds, input fields
  gray200: '#f0f0f0',       // Borders, dividers, progress track
  gray400: '#cccccc',       // Inactive icons, placeholders
  gray600: '#888888',       // Secondary/supporting text

  // Special — do NOT reuse
  orange: '#f97316',        // Streak ONLY — nowhere else

  // Semantic aliases (for readability in components)
  bg: '#ffffff',
  surface: '#f5f5f5',
  border: '#f0f0f0',
  text: '#111111',
  textSecondary: '#888888',
  textMuted: '#cccccc',
  textInverse: '#ffffff',
  streak: '#f97316',
} as const

export type ColorKey = keyof typeof colors
