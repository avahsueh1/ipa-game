-- Apply in the intended Supabase project. Never put a service-role key in Vite.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text check (char_length(username) <= 50),
 created_at timestamptz not null default now()
);
create table if not exists public.lesson_events (
 user_id uuid not null references auth.users(id) on delete cascade,
 id uuid not null,
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and payload ?& array['id','lessonId','startedAt','completedAt','attempts']),
 created_at timestamptz not null default now(),
 primary key (user_id, id),
 constraint matching_event_id check (payload->>'id' = id::text)
);
alter table public.profiles enable row level security;
alter table public.lesson_events enable row level security;
create policy "Own profile only" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Own learning events only" on public.lesson_events for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.profiles, public.lesson_events to authenticated;
revoke all on public.profiles, public.lesson_events from anon;
-- Progress comes from immutable completion IDs so guest imports do not double count XP.
-- These views inherit the underlying table's RLS.
create or replace view public.user_stats with (security_invoker = true) as
select user_id,
 count(*) filter (where payload->>'completedAt' is not null) as lessons_finished,
 count(*) as lessons_started,
 coalesce(sum(case when payload->>'completedAt' is not null then 20 + 10 *
 (select count(*) from jsonb_array_elements(payload->'attempts') a where a->>'correct' = 'true') else 0 end),0) as xp,
 max(payload->>'day') as last_active_date
from public.lesson_events group by user_id;
create or replace view public.sound_progress with (security_invoker = true) as
select e.user_id, a->>'soundId' as sound_id, count(*) as attempts,
 count(*) filter(where a->>'correct'='true') as correct,
 max(e.payload->>'completedAt') as last_seen
from public.lesson_events e cross join lateral jsonb_array_elements(e.payload->'attempts') a
where e.payload->>'completedAt' is not null group by e.user_id, a->>'soundId';
grant select on public.user_stats, public.sound_progress to authenticated;
