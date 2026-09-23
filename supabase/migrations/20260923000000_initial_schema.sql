-- Migração inicial do banco do ENADE CC.
-- Mantida em sincronia com ../schema.sql para facilitar leitura e execução manual.

create table if not exists public.students (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  github_url text,
  current_stage text not null default 'revisao' check (current_stage in ('inicio', 'revisao', 'concluinte')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 0 and 15),
  total integer not null default 15 check (total = 15),
  answers_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  attempted integer not null default 0 check (attempted >= 0),
  correct integer not null default 0 check (correct >= 0 and correct <= attempted),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic)
);

alter table public.students enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.topic_progress enable row level security;

drop policy if exists "students read own profile" on public.students;
create policy "students read own profile" on public.students for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "students insert own profile" on public.students;
create policy "students insert own profile" on public.students for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "students update own profile" on public.students;
create policy "students update own profile" on public.students for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "students read own attempts" on public.quiz_attempts;
create policy "students read own attempts" on public.quiz_attempts for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "students insert own attempts" on public.quiz_attempts;
create policy "students insert own attempts" on public.quiz_attempts for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "students read own progress" on public.topic_progress;
create policy "students read own progress" on public.topic_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "students insert own progress" on public.topic_progress;
create policy "students insert own progress" on public.topic_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "students update own progress" on public.topic_progress;
create policy "students update own progress" on public.topic_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.save_enade_attempt(
  p_attempt_id uuid,
  p_score integer,
  p_answers jsonb,
  p_created_at timestamptz
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  student_id uuid := auth.uid();
begin
  if student_id is null then raise exception 'Autenticação necessária'; end if;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) <> 15 then raise exception 'O simulado deve conter 15 respostas'; end if;
  if p_score < 0 or p_score > 15 then raise exception 'Pontuação inválida'; end if;

  insert into public.quiz_attempts (id, user_id, score, total, answers_json, created_at)
  values (p_attempt_id, student_id, p_score, 15, p_answers, p_created_at);

  insert into public.topic_progress (user_id, topic, attempted, correct, updated_at)
  select student_id, answer->>'topic', count(*)::integer,
         count(*) filter (where (answer->>'correct')::boolean)::integer, p_created_at
  from jsonb_array_elements(p_answers) as item(answer)
  group by answer->>'topic'
  on conflict (user_id, topic) do update
    set attempted = public.topic_progress.attempted + excluded.attempted,
        correct = public.topic_progress.correct + excluded.correct,
        updated_at = excluded.updated_at;

  return p_attempt_id;
end;
$$;

revoke all on function public.save_enade_attempt(uuid, integer, jsonb, timestamptz) from public, anon;
grant execute on function public.save_enade_attempt(uuid, integer, jsonb, timestamptz) to authenticated;
grant select, insert, update on public.students to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select, insert, update on public.topic_progress to authenticated;
