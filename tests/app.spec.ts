import { test, expect } from "@playwright/test";
import { stats, mergeEvents, localDay } from "../src/progress";
import type { LessonEvent } from "../src/progress";
import { sounds, lessons } from "../src/data";
import { readFileSync, existsSync } from "node:fs";
test("streaks handle local calendar boundaries and imports do not double count", () => {
  const e = (id: string, day: string): LessonEvent => ({
    id,
    lessonId: "1-0",
    day,
    startedAt: day,
    completedAt: day,
    attempts: [{ soundId: "sound-0", correct: true }],
  });
  const events = [e("a", "2026-09-20"), e("b", "2026-09-21")];
  expect(stats(mergeEvents(events, events), new Date(2026, 8, 21)).xp).toBe(60);
  expect(stats(events, new Date(2026, 8, 22)).streak).toBe(2);
  expect(stats(events, new Date(2026, 8, 23)).streak).toBe(0);
  expect(localDay(new Date(2026, 0, 1))).toBe("2026-01-01");
});
test("unfinished lessons earn nothing and imports preserve completed events", () => {
  const unfinished: LessonEvent = {
    id: "same-id",
    lessonId: "1-0",
    startedAt: "2026-09-21T00:00:00Z",
    completedAt: null,
    day: null,
    attempts: [{ soundId: "sound-0", correct: true }],
  };
  const completed: LessonEvent = {
    ...unfinished,
    completedAt: "2026-09-21T00:01:00Z",
    day: "2026-09-21",
  };
  expect(stats([unfinished]).xp).toBe(0);
  expect(stats([unfinished]).completed.size).toBe(0);
  for (const merged of [
    mergeEvents([unfinished], [completed]),
    mergeEvents([completed], [unfinished]),
  ]) {
    expect(merged).toEqual([completed]);
    expect(stats(merged, new Date(2026, 8, 21)).xp).toBe(30);
  }
  expect(
    stats([completed, { ...completed, id: "replay" }], new Date(2026, 8, 21))
      .streak,
  ).toBe(1);
});
test("every curriculum sound has credited, bundled Ogg audio", () => {
  const credits = JSON.parse(readFileSync("src/audio-credits.json", "utf8"));
  expect(credits).toHaveLength(sounds.length);
  for (const s of sounds) {
    expect(existsSync(`public/audio/${s.id}.ogg`)).toBeTruthy();
    expect(
      readFileSync(`public/audio/${s.id}.ogg`).subarray(0, 4).toString(),
    ).toBe("OggS");
    const c = credits.find((c: any) => c.id === s.id);
    expect(c.author).toBeTruthy();
    expect(c.license).toBeTruthy();
  }
});
test("guest can finish lessons, retain XP, and unlock the next level", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A world of sounds awaits." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Find your footing, locked" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Let’s play", exact: true }).click();
  await page.getByRole("button", { name: "Play question sound" }).click();
  await expect(
    page.getByText("That recording could not play.", { exact: false }),
  ).toHaveCount(0);
  for (let i = 0; i < 6; i++) {
    if (i === 1) {
      await page
        .getByRole("button", { name: "Play option 1", exact: true })
        .click();
    }
    await page.locator(".answer").first().click();
    await expect(page.locator(".feedback")).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 5 ? "Finish lesson" : "Continue",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Look at you grow!" }),
  ).toBeVisible();
  const earned = await page.locator(".earned").innerText();
  expect(earned).toContain("XP");
  await page.getByRole("button", { name: "Back to my trail" }).click();
  const first = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ribbit:guest:v1")!),
  );
  expect(first.filter((e: any) => e.completedAt)).toHaveLength(1);
  await page.reload();
  await expect(page.getByText("1 / 15 lessons")).toBeVisible();
  await page.getByRole("button", { name: "Continue learning" }).click();
  for (let i = 0; i < 6; i++) {
    await page.locator(".answer").first().click();
    await page
      .getByRole("button", {
        name: i === 5 ? "Finish lesson" : "Continue",
        exact: true,
      })
      .click();
  }
  await page.getByRole("button", { name: "Back to my trail" }).click();
  await expect(
    page.getByRole("button", { name: "Find your footing", exact: true }),
  ).toBeEnabled();
  expect(errors).toEqual([]);
});
test("library search, audio decode, exit confirmation, and small screen layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({
    path: "artifacts/ribbit-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page
    .getByRole("button", { name: "Sound library", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Search sounds" }).fill("moon");
  await expect(page.locator(".sound-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Play m", exact: true }).click();
  const decodable = await page.evaluate(async () => {
    const context = new AudioContext();
    try {
      const bytes = await (await fetch("/audio/sound-2.ogg")).arrayBuffer();
      return (await context.decodeAudioData(bytes)).duration > 0;
    } finally {
      await context.close();
    }
  });
  expect(decodable).toBeTruthy();
  await page.getByRole("button", { name: "My learning", exact: true }).click();
  await page.getByRole("button", { name: "Let’s play", exact: true }).click();
  await page.getByRole("button", { name: "Exit lesson" }).click();
  await expect(page.getByText("Take a little break?")).toBeVisible();
  await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  const events = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("ribbit:guest:v1")!),
  );
  expect(events[0].completedAt).toBeNull();
});
test("desktop visual and complete audio decode", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "artifacts/ribbit-desktop.png",
    fullPage: true,
  });
  const decoded = await page.evaluate(
    async (ids) => {
      const context = new AudioContext();
      const failures: string[] = [];
      for (const id of ids) {
        try {
          const r = await fetch(`/audio/${id}.ogg`);
          if (!r.ok) throw Error();
          const audio = await context.decodeAudioData(await r.arrayBuffer());
          if (!audio.duration) throw Error();
        } catch {
          failures.push(id);
        }
      }
      await context.close();
      return failures;
    },
    sounds.map((s) => s.id),
  );
  expect(decoded).toEqual([]);
});
