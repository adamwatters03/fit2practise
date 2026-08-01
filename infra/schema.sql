-- Fit to Practise — core schema (applied automatically by the infra workflow).
-- Idempotent: safe to run repeatedly.

-- ---------- purchases (written by the payment functions via service role) ----------
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  session_id text not null,
  course_id text not null,
  email text,
  amount integer,
  created_at timestamptz not null default now(),
  unique (session_id, course_id)
);
alter table public.purchases enable row level security;

-- Logged-in users can see their own purchases (matched by verified email).
drop policy if exists "own purchases by email" on public.purchases;
create policy "own purchases by email" on public.purchases
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt()->>'email','')));

-- ---------- gated course content ----------
create table if not exists public.course_content (
  course_id text primary key,
  title text,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.course_content enable row level security;

-- Only purchasers may read a course's content.
drop policy if exists "purchasers read content" on public.course_content;
create policy "purchasers read content" on public.course_content
  for select to authenticated
  using (exists (
    select 1 from public.purchases p
    where p.course_id = course_content.course_id
      and lower(p.email) = lower(coalesce(auth.jwt()->>'email',''))
  ));

-- ---------- per-user progress ----------
create table if not exists public.progress (
  user_id uuid not null,
  course_id text not null,
  pct integer not null default 0 check (pct between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
alter table public.progress enable row level security;

drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
