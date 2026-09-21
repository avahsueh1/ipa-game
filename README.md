# Ribbit /ˈɹɪbɪt/

A gentle IPA learning game with Pip, a turquoise dart frog. Built with React, TypeScript, Vite, and Supabase. The original product brief is preserved in `MVP.md`; the approved Ribbit branding replaces its cat theme.

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

Initial verification: production build and progress unit checks passed. Browser checks confirmed correct/incorrect answer feedback, two completed lessons, XP and streak persistence after reload, and level-two unlocking. Anonymous database reads were rejected. The full automated browser suite, mobile layout checks, cross-account SQL verification, and real email sign-in remain to be run; browser automation became unavailable during responsive testing.

## This first build

- Five levels, 15 lessons, 43 curriculum sounds.
- Six questions per lesson covering audio → symbol, symbol → audio, and symbol → features.
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

Before using email login on a new URL, allow that exact origin under Authentication → URL Configuration. Configure and verify SMTP and email delivery before inviting public testers. End-to-end email delivery and guest-to-account import need a real sign-in test. The app intentionally presents sign-in as an adult/parent/teacher flow; guest play needs no personal data.

The dashboard reported **No repository connected** during initial setup. GitHub integration and website hosting are separate setup steps; neither is implied by the public Supabase URL.

## Audio

`npm run audio:fetch` downloads the curriculum's original recordings and preserves source/author/license metadata in `src/audio-credits.json`. The importer honors Wikimedia's `Retry-After` and uses a slow sequential download rate. Existing audio is reused. Wikimedia attribution requirements remain attached to the audio; these files are not relicensed by this project.

## Deployment

The app builds to `dist/`, suitable for Vercel or Netlify. Set the two public Supabase environment variables for the deployment, build with `npm run build`, and add the final site's URL to Supabase's redirect allowlist. No production deployment is created by this initial build.
