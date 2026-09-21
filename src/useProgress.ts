import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./backend";
import { mergeEvents, readEvents, type LessonEvent } from "./progress";
const guestKey = "ribbit:guest:v1";
export function useProgress() {
  const [user, setUser] = useState<User | null>(null),
    [events, setEvents] = useState<LessonEvent[]>(() => readEvents(guestKey)),
    [status, setStatus] = useState("Saved on this device"),
    [ready, setReady] = useState(!supabase);
  const key = useRef(guestKey),
    revision = useRef(0),
    saveQueue = useRef(Promise.resolve());
  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user || null);
        if (!data.session) setReady(true);
      })
      .catch(() => {
        setStatus(
          "Account connection unavailable. You can keep learning as a guest.",
        );
        setReady(true);
      });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const generation = ++revision.current;
    key.current = user ? `ribbit:user:${user.id}` : guestKey;
    const local = readEvents(key.current);
    setEvents(local);
    setReady(!user);
    setStatus("Saved on this device");
    if (!user || !supabase) return;
    const client = supabase;
    setStatus("Loading saved progress…");
    void (async () => {
      const { data, error } = await client
        .from("lesson_events")
        .select("payload")
        .eq("user_id", user.id);
      if (generation !== revision.current) return;
      if (error) {
        setStatus("Cloud unavailable. Progress will save on this device.");
        setReady(true);
        return;
      }
      const guest = readEvents(guestKey);
      const merged = mergeEvents(
        local,
        (data || []).map((row) => row.payload as LessonEvent),
        guest,
      );
      setEvents(merged);
      localStorage.setItem(key.current, JSON.stringify(merged));
      const result = merged.length
        ? await client.from("lesson_events").upsert(
            merged.map((e) => ({ id: e.id, user_id: user.id, payload: e })),
            { onConflict: "user_id,id" },
          )
        : { error: null };
      if (generation !== revision.current) return;
      if (!result.error) {
        localStorage.removeItem(guestKey);
        setStatus("Progress synced");
      } else setStatus("Saved on this device. Cloud sync needs a retry.");
      setReady(true);
    })().catch(() => {
      if (generation === revision.current) {
        setStatus("Cloud unavailable. Progress will save on this device.");
        setReady(true);
      }
    });
  }, [user?.id]);
  function save(event: LessonEvent) {
    const currentRevision = revision.current;
    setEvents((previous) => {
      const next = previous.filter((e) => e.id !== event.id).concat(event);
      try {
        localStorage.setItem(key.current, JSON.stringify(next));
      } catch {
        setStatus(
          "Browser storage is full. Keep this tab open to retain progress.",
        );
      }
      return next;
    });
    if (user && supabase) {
      const client = supabase;
      const userId = user.id;
      saveQueue.current = saveQueue.current
        .catch(() => {})
        .then(async () => {
          const { error } = await client
            .from("lesson_events")
            .upsert(
              { id: event.id, user_id: userId, payload: event },
              { onConflict: "user_id,id" },
            );
          if (currentRevision === revision.current)
            setStatus(
              error
                ? "Saved on this device. Cloud sync needs a retry."
                : "Progress synced",
            );
        })
        .catch(() => {
          if (currentRevision === revision.current)
            setStatus("Saved on this device. Cloud sync needs a retry.");
        });
    }
  }
  return { user, events, save, status, ready };
}
