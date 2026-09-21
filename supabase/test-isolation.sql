-- Development verification only. All synthetic records roll back in this transaction.
begin;
insert into auth.users (id, aud, role) values
 ('00000000-0000-4000-8000-000000000001','authenticated','authenticated'),
 ('00000000-0000-4000-8000-000000000002','authenticated','authenticated');
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
insert into public.lesson_events(user_id,id,payload) values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000003','{"id":"00000000-0000-4000-8000-000000000003","lessonId":"1-0","startedAt":"2026-09-21T00:00:00Z","completedAt":"2026-09-21T00:01:00Z","day":"2026-09-21","attempts":[{"soundId":"sound-0","correct":true}]}');
do $$ begin
 if (select count(*) from public.lesson_events) <> 1 then raise exception 'Owner cannot read own event'; end if;
 if (select xp from public.user_stats) <> 30 then raise exception 'XP calculation failed'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
do $$ begin
 if (select count(*) from public.lesson_events) <> 0 then raise exception 'Cross-user event exposed'; end if;
 if (select count(*) from public.user_stats) <> 0 then raise exception 'Cross-user stats exposed'; end if;
 if (select count(*) from public.sound_progress) <> 0 then raise exception 'Cross-user sound progress exposed'; end if;
 begin
  insert into public.lesson_events(user_id,id,payload) values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000004','{"id":"00000000-0000-4000-8000-000000000004","lessonId":"1-0","startedAt":"2026-09-21T00:00:00Z","completedAt":null,"attempts":[]}');
  raise exception 'Cross-user write unexpectedly succeeded';
 exception when insufficient_privilege then null;
 end;
end $$;
rollback;
