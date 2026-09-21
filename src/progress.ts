export type Attempt = { soundId: string; correct: boolean };
export type LessonEvent = {
  id: string;
  lessonId: string;
  startedAt: string;
  completedAt: string | null;
  day: string | null;
  attempts: Attempt[];
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function mergeEvents(...groups: LessonEvent[][]) {
  const map = new Map<string, LessonEvent>();
  for (const event of groups.flat()) {
    const old = map.get(event.id);
    if (!old || (!old.completedAt && event.completedAt))
      map.set(event.id, event);
  }
  return [...map.values()];
}
export function stats(events: LessonEvent[], now = new Date()) {
  const done = events.filter((e) => e.completedAt);
  const dates = new Set(done.map((e) => e.day));
  let streak = 0;
  const d = new Date(now);
  if (!dates.has(localDay(d))) d.setDate(d.getDate() - 1);
  while (dates.has(localDay(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return {
    xp: done.reduce(
      (sum, e) => sum + 20 + e.attempts.filter((a) => a.correct).length * 10,
      0,
    ),
    streak,
    completed: new Set(done.map((e) => e.lessonId)),
    learned: new Set(
      done.flatMap((e) =>
        e.attempts.filter((a) => a.correct).map((a) => a.soundId),
      ),
    ).size,
  };
}
export function readEvents(key: string): LessonEvent[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value)
      ? value.filter(
          (e) =>
            typeof e.id === "string" &&
            typeof e.lessonId === "string" &&
            Array.isArray(e.attempts) &&
            e.attempts.every(
              (a: Attempt) =>
                typeof a.soundId === "string" && typeof a.correct === "boolean",
            ),
        )
      : [];
  } catch {
    return [];
  }
}
