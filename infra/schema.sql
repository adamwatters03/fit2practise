-- Fit to Practise — core schema (applied automatically by the infra workflow
-- once the SUPABASE_DB_URL secret is set). Idempotent.

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

-- No public access: only the service role (used by the serverless functions)
-- can read/write purchases. Authenticated users get access via views/functions
-- added in the auth phase.
drop policy if exists "service role only" on public.purchases;
