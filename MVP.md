# MVP Doc: [App Name] — Learn the Sounds of Every Language 🐾

**Author:** Elisa Chin
**Status:** Draft v1
**Target launch:** Same-day MVP (web)

---

## 1. Overview

[App Name] is a gamified web app that teaches kids and beginners the **International Phonetic Alphabet (IPA)**. The IPA is the "secret code" for how every sound in every language is made. When learners know the symbols and what their mouth does for each one, they can pronounce new words in any language correctly from the start.

The app uses short quizzes, levels, XP, and streaks to make practice feel like a game. A minimal, friendly cat mascot guides the learner through each level.

---

## 2. Problem

- Most language apps teach vocabulary and grammar first and treat pronunciation as an afterthought. Learners end up memorizing words they say wrong.
- The IPA solves this, but it's usually taught to university linguistics students with dense charts and technical terms like "voiceless bilabial plosive." Nothing about it is built for kids or beginners.
- Existing IPA tools, like interactive charts, are reference tools, not learning tools. There's no progression, no practice loop, and no reason to come back.

**Opportunity:** Turn the IPA chart into a playful, level-based game that a 10-year-old could pick up, with no linguistics background needed.

---

## 3. Target Users

**Primary:** Kids (assumed ~8–13) and complete beginners who are curious about languages or starting to learn one.

**Secondary:** Parents and teachers looking for a fun pronunciation tool, and adult beginners who want a gentler on-ramp than a textbook.

**Assumption for v1:** Users are English speakers. "Familiar" sounds are the ones English already uses.

### User stories

- As a kid, I want to hear a sound and guess its symbol so that learning feels like a game, not homework.
- As a beginner, I want to start with sounds I already know so that I feel confident before trying new ones.
- As a learner, I want to earn XP and keep a streak so that I have a reason to come back tomorrow.
- As a learner, I want to unlock new levels so that I can see my progress.
- As a parent or teacher, I want the app to be simple and safe so that a child can use it without help.

---

## 4. Goals & Success Metrics

| Goal | Metric | v1 target |
|---|---|---|
| Learners finish what they start | **Lesson completion rate** (lessons finished ÷ lessons started) | ≥ 70% |
| Learners come back | **Return visits / streak length** (% of users returning on day 2 and day 7; average streak) | Track baseline with first tester group |

**Measurement plan:** Recruit a small tester group right after launch (classmates, younger siblings, family friends) so there's real data after 1–2 weeks. Collect short qualitative feedback alongside the numbers.

---

## 5. Scope

### P0 — Must ship

- **Content:** Pulmonic consonants and vowels from the IPA chart (~85 sounds), each with a symbol, an audio clip, and feature tags.
- **Levels:** Five levels, ordered from familiar English sounds to brand-new sounds (see §6).
- **Quiz types** (see §7):
  1. Hear sound → pick symbol
  2. See symbol → pick sound
  3. See symbol → pick features (in kid-friendly words)
- **Gamification:** XP, level progress, and daily streaks.
- **Accounts:** Supabase auth, with progress, XP, and streaks saved per user.
- **Guest mode:** Play without signing up. Progress saves in the browser and moves to the account on sign-up.
- **Audio credits page:** Attribution for all audio clips.

### P1 — Ships if time allows

- **Quiz type 4:** Build a sound from features (pick the mouth part + how + voice on/off, then hear the result).
- Simple mouth illustrations for each place of articulation.
- Example words for English sounds ("p as in pig").

### Out of scope for v1

- Non-pulmonic consonants (clicks, ejectives, implosives)
- Affricates, diacritics, and "other symbols" (except **w**, which is needed for English)
- Speech recognition / grading the learner's own pronunciation
- Native languages other than English
- Mobile app
- Leaderboards, friends, or any social features

---

## 6. Levels & Curriculum

Levels go from **sounds kids already make** to **sounds from other languages**. Each level also introduces one new "mouth idea" in plain language. Technical terms are hidden at first and unlock at higher levels.

| Level | Name | Sounds | Mouth idea introduced |
|---|---|---|---|
| 1 | **Kitten** 🐱 | Easy, visible English consonants: p b m f v w | **Voice on / voice off** — put your hand on your throat. Does it buzz? |
| 2 | **Curious Cat** | More English consonants: t d n s z l k g h | **Where** — lips, teeth, tongue tip, back of the mouth |
| 3 | **Clever Cat** | Trickier English consonants: θ ð ʃ ʒ ŋ ɹ j | **How** — stop the air (pop), squeeze it (hiss), or let it flow (hum) |
| 4 | **Singing Cat** | English vowels: i ɪ e ɛ æ ɑ ɔ o ʊ u ʌ ə | **Vowels** — mouth open or closed, tongue front or back, lips round or smiley |
| 5 | **World Traveler Cat** ✈️ | New sounds from other languages (e.g. y ø x ʁ ɲ ʎ ɸ β ç) | **Real names unlocked** — "voiced bilabial plosive" and friends |

- Each level is made of short **lessons** (5–8 questions, ~2 minutes).
- A level unlocks when the learner finishes the previous one. Kids can always replay old levels.
- Remaining chart sounds not listed above can be added as extra Level 5 lessons as content grows.

### Kid-friendly feature names

| Technical term | Kid version |
|---|---|
| Voiced / voiceless | Voice on (buzz) / voice off (whisper) |
| Bilabial | Both lips |
| Labiodental | Teeth on lip |
| Dental / Alveolar | Tongue behind teeth |
| Velar | Back of the mouth |
| Plosive | Pop |
| Fricative | Hiss |
| Nasal | Hum through your nose |
| Close / Open (vowels) | Mouth almost closed / mouth wide open |
| Front / Back (vowels) | Tongue forward / tongue pulled back |
| Rounded / Unrounded | Kissy lips / smiley lips |

---

## 7. Quiz Types

All quiz types read from the same sound data, so adding a new type doesn't require new content.

| # | Quiz type | How it works | Priority |
|---|---|---|---|
| 1 | Hear → pick symbol | Play a sound, choose the right symbol from 3–4 options | P0 |
| 2 | See symbol → pick sound | Show a symbol, play 3–4 sounds, choose the match | P0 |
| 3 | See symbol → pick features | Show a symbol, choose its features (kid words at Levels 1–4) | P0 |
| 4 | Build a sound | Pick features step by step, then hear which sound you built | P1 |

**Kid-friendly rules for all quizzes:**
- Big buttons, minimal reading, and a replay button on every sound.
- Wrong answers are never punished. Show the right answer, play the sound, and move on.
- No lives or hearts, so kids never get locked out.
- Early levels have fewer answer options (3). Later levels have more (4).

---

## 8. Gamification

| Mechanic | How it works |
|---|---|
| **XP** | +10 per correct answer, +20 bonus for finishing a lesson |
| **Levels** | Progress bar fills as XP grows; completing a level unlocks the next cat |
| **Streaks** | One paw print 🐾 per day with at least one finished lesson |

**Kind streaks:** Missing a day resets the streak quietly, with an encouraging message ("Welcome back! Let's start a new streak"). No guilt messages or push notifications aimed at kids.

---

## 9. Design: Minimal Cat Theme

**Principle:** Cute, but calm. Lots of white space, one mascot, and nothing blinking or cluttered.

- **Mascot:** One simple line-drawn cat (thin outline, no shading). It changes pose by level (kitten → traveler with a tiny backpack) and reacts to answers (happy blink when correct, head tilt when wrong).
- **Palette:** White/cream background, one soft accent color for buttons and progress, and a light gray for secondary text.
- **Typography:** One rounded, highly readable sans-serif. Large IPA symbols (the symbol is the star of every screen).
- **Small cat details (used sparingly):**
  - Paw prints for streaks
  - Tiny ears on top of the progress bar
  - A yarn ball that unrolls as the lesson progresses
- **Motion:** Short, gentle animations only (the cat blinks, the progress bar slides). Nothing distracting during the question.

### Key screens

1. **Home:** Mascot, current level, streak, "Play" button
2. **Level map:** Five cats in a row; locked ones shown as outlines
3. **Lesson:** Question, big symbol or play button, answer choices, yarn-ball progress
4. **Lesson complete:** XP earned, happy cat, "Next lesson" button
5. **Sign up / log in:** Simple, with "Play as guest" option
6. **Credits:** Audio attributions

---

## 10. Technical Approach

| Area | Choice |
|---|---|
| Frontend | React web app |
| Auth + database | Supabase |
| Sound content | Static JSON file bundled with the app |
| Audio | Open-licensed IPA recordings from Wikimedia Commons (credited on Credits page) |
| Hosting | Vercel or Netlify |

### Sound data (static JSON)

```json
{
  "id": "p",
  "symbol": "p",
  "type": "consonant",
  "voicing": "voiceless",
  "place": "bilabial",
  "manner": "plosive",
  "kid": { "voice": "off", "where": "both lips", "how": "pop" },
  "inEnglish": true,
  "exampleWord": "pig",
  "level": 1,
  "audio": "/audio/p.mp3"
}
```

Vowels use `height`, `backness`, and `rounding` instead of `place`, `manner`, and `voicing`.

### Supabase tables

- **profiles:** `id`, `username`, `created_at`
- **user_stats:** `user_id`, `xp`, `level`, `current_streak`, `longest_streak`, `last_active_date`
- **sound_progress:** `user_id`, `sound_id`, `attempts`, `correct`, `last_seen`
- **lesson_events:** `user_id`, `lesson_id`, `started_at`, `completed_at` (powers the completion-rate metric)

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Kids' privacy.** Collecting personal info (like email) from children under 13 triggers US children's privacy rules (COPPA). | Guest mode by default; collect the minimum possible; consider parent/teacher-created accounts or username-only logins. Research requirements before any public launch aimed at kids. |
| Supabase auth takes longer than planned | Guest mode ships first, so the core game works even if login isn't ready. |
| Recorded IPA audio is a rough guide and varies by speaker | Note this on the Credits page; prioritize clear recordings for Levels 1–4. |
| ~85 sounds is a lot of content to tag in one day | Ship Levels 1–4 (English sounds) first; add Level 5 sounds as a follow-up. |
| Technical terms scare kids off | Kid-friendly feature names by default; real terms unlock at Level 5. |

---

## 12. Open Questions

- **App name?** Cat-pun ideas to react to: *Purrnounce*, *Meowphonics*, *Whisker Sounds*.
- **Exact age range?** This affects reading level, account setup, and privacy requirements.
- **What does "done today" mean?** Deployed and live, or working locally?
- **Audio source:** Use Wikimedia recordings as-is, or record a few custom clips for English example words?
- **Teacher use:** Should a future version let teachers create class accounts?

---

## 13. Future Ideas (post-MVP)

- Speech recognition to grade the learner's own pronunciation
- Non-pulmonic consonants as a bonus "Adventure Cat" level
- Native-language picker (familiar sounds change per language)
- Language packs: "the sounds you need for Spanish / Japanese / French"
- Teacher dashboard and class streaks
