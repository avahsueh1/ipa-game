# Ribbit /ˈɹɪbɪt/

A gentle IPA learning game with Riff, a turquoise dart frog. Built with React, TypeScript, Vite, and Supabase. The original product brief is preserved in `MVP.md`; the approved Ribbit branding replaces its cat theme.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Guest mode works without environment variables. To enable accounts, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to your project's public client configuration. Never use a service-role or secret key in a `VITE_` variable.

```sh
npm run build
npm test
```

The browser tests use an installed Chrome. Alternatively install Playwright Chromium and remove `channel: "chrome"` from `playwright.config.ts`.

Verification (September 21): production build and four focused progress/audio tests passed. Browser checks covered a complete guided module and checkpoint, a separate game completion, crown display, unchanged course progress after a game, and mobile navigation/cards without horizontal overflow. Supabase transactional tests passed for owner access, cross-account read/write denial, and XP aggregation; test records rolled back. Real email sign-in and guest-to-account import remain unverified pending a test inbox and SMTP setup. The full automated browser suite has not been run.

## This first build

- Five levels, 15 lessons, 43 curriculum sounds.
- Guided modules teach each sound with recordings, examples, and articulation notes before a six-question checkpoint.
- Separate Games section: Sound detective, Perfect match, and Mouth moves, with all five sound groups available for practice. Games earn XP and streak credit but do not unlock course lessons.
- Full-body SVG Riff wears a crown after a completed lesson or game today. The crown resets each local calendar day; yesterday’s ongoing streak is preserved.
- 10 XP per correct answer, 20 XP completion bonus, local-calendar streaks, level unlocking, and replay.
- Browser-saved guest progress, adult email-link sign-in, and import of guest events into an account.
- Searchable sound library with kid-friendly articulation hints and accent notes.
- Original SVG mascot, phonetic wordmark, and app icon. `/brand.html` presents downloadable brand assets. The wordmark contains only vector paths, with no font dependency.
- Unmodified Wikimedia Commons recordings, with per-file attribution and licenses in the app's credits page.

This is an initial 43-sound curriculum, not all approximately 85 sounds in the full MVP. The remaining chart sounds are follow-up content. Some recordings include an /a/ vowel around a consonant; the UI explains this. Example English vowels depend on the learner's accent. /e/ and /o/ are steady vowels rather than English diphthongs.

## Supabase

Project: `fxlaeknwphtegtvcceef`. The initial migration was applied to this project on September 21, 2026 through the dashboard. For a different project, apply `supabase/migrations/202609210001_progress.sql`.

`lesson_events` stores started and completed lesson events. An event keeps its UUID when completed or imported, allowing imports to deduplicate XP. User stats and sound progress are reporting views; streaks and level progress are computed from completed events in the app. Tables use row-level security, and reporting views use `security_invoker` to preserve it. Anonymous users have no access to account data.

`supabase/test-isolation.sql` verifies ownership, cross-account reads/writes, and XP aggregation with synthetic records inside a rolled-back transaction.

Email provider, new signups, and email confirmation are enabled. Site URL is `http://127.0.0.1:5173`; exact redirect origins `http://127.0.0.1:5173` and `http://localhost:5173` are allowlisted. Custom SMTP is currently off, so the default sender only delivers to project-team addresses (see https://supabase.com/docs/guides/auth/auth-smtp). Public signups require an SMTP provider and verified sender domain. No test email has been sent.

Before using email login on a new URL, allow that exact origin under Authentication → URL Configuration. Configure and verify SMTP and email delivery before inviting public testers. End-to-end email delivery and guest-to-account import need a real sign-in test. The app intentionally presents sign-in as an adult/parent/teacher flow; guest play needs no personal data.

The dashboard reported **No repository connected** during initial setup. GitHub integration and website hosting are separate setup steps; neither is implied by the public Supabase URL.

## Audio

`npm run audio:fetch` downloads the curriculum's original recordings and preserves source/author/license metadata in `src/audio-credits.json`. The importer honors Wikimedia's `Retry-After` and uses a slow sequential download rate. Existing audio is reused. Wikimedia attribution requirements remain attached to the audio; these files are not relicensed by this project.

## Deployment

The app builds to `dist/`, suitable for Vercel or Netlify. Set the two public Supabase environment variables for the deployment, build with `npm run build`, and add the final site's URL to Supabase's redirect allowlist. No production deployment is created by this initial build.
