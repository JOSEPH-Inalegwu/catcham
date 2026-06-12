# RULES.md — CatchAm AI

## Code

Write clean, readable code. If someone else cannot understand it in thirty seconds, rewrite it.

TypeScript only in the frontend. No JavaScript files in the Next.js app.

No hardcoded values. API URLs, keys, and environment-specific config go in environment variables only.

Keep files small. Components over 150 lines get split. Functions do one thing.

Every page that fetches data must handle loading and error states. No exceptions.

All Supabase calls go through lib/supabase.ts. All backend API calls go through lib/api.ts. Never call either directly from a component.

Use server components by default. Add use client only when the component genuinely needs it.

## Design

No AI slop fonts. Use Inter or Geist only.

No generic designs. No cookie-cutter layouts, no default shadcn patterns left unstyled, no out-of-the-box component libraries dropped in without being properly adapted to the CatchAm design system.

No decorative gradients used for the sake of it. Every visual decision must have a reason.

Spacing, colour, and typography must stay consistent with what is defined in AGENT.md. Do not improvise.

## Commits

Commit messages are short and plain. One line. No emojis. No AI-generated commit summaries.

Good: add file upload component, fix forensic report layout, update supabase auth flow

Bad: ✨ feat: implement revolutionary file upload system with cutting-edge UX

No secrets, API keys, or environment variables ever appear in a commit. Check before every push.

## General

Build what is in scope. Do not add features that were not asked for.

When something cannot be done cleanly, say so. Do not patch over a bad approach with more code.

Plain English only. No technical jargon in comments, commit messages, or documentation unless the term has no simpler equivalent.

---

Short, plain, and enforceable. Every rule has a reason behind it.