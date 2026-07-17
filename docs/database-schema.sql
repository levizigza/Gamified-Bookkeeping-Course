-- Ledger Quest — Supabase-ready database schema
-- Run in the Supabase SQL editor or via `supabase db push` after review.
-- No live connection required for local development; this file is the contract.

-- ---------------------------------------------------------------------------
-- Extensions & helpers
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text not null default 'Bright Path Consulting',
  display_name text,
  currency text not null default 'CAD' check (currency in ('CAD', 'USD')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, business_name, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'business_name', 'Bright Path Consulting'),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name')
  );
  insert into public.user_progress (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Course catalog (shared content)
-- ---------------------------------------------------------------------------

create table public.courses (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table public.modules (
  id text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  week integer not null check (week between 1 and 52),
  title text not null,
  subtitle text,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index modules_course_id_idx on public.modules (course_id);

create trigger modules_set_updated_at
before update on public.modules
for each row execute function public.set_updated_at();

create table public.lessons (
  id text primary key,
  module_id text not null references public.modules (id) on delete cascade,
  title text not null,
  description text,
  duration_minutes integer not null default 10 check (duration_minutes > 0),
  sort_order integer not null default 0,
  content jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lessons_module_id_idx on public.lessons (module_id);

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

create table public.challenges (
  id text primary key,
  lesson_id text references public.lessons (id) on delete set null,
  module_id text not null references public.modules (id) on delete cascade,
  title text not null,
  description text,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  pass_threshold_percent integer not null default 80
    check (pass_threshold_percent between 0 and 100),
  sort_order integer not null default 0,
  content jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index challenges_module_id_idx on public.challenges (module_id);
create index challenges_lesson_id_idx on public.challenges (lesson_id);

create trigger challenges_set_updated_at
before update on public.challenges
for each row execute function public.set_updated_at();

create table public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  learning_outcome text not null,
  module_id text references public.modules (id) on delete set null,
  rule text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger badges_set_updated_at
before update on public.badges
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- User progress & attempts
-- ---------------------------------------------------------------------------

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak_days integer not null default 0 check (streak_days >= 0),
  best_answer_streak integer not null default 0 check (best_answer_streak >= 0),
  last_practice_date date,
  mastery_percent integer not null default 0
    check (mastery_percent between 0 and 100),
  bonus_xp integer not null default 0 check (bonus_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_progress_user_id_idx on public.user_progress (user_id);

create trigger user_progress_set_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

create table public.challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  challenge_id text not null references public.challenges (id) on delete cascade,
  module_id text not null references public.modules (id) on delete cascade,
  attempt_number integer not null default 1 check (attempt_number >= 1),
  correct boolean not null default false,
  first_try boolean not null default true,
  score_percent integer not null default 0
    check (score_percent between 0 and 100),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  weak_tags text[] not null default '{}',
  metadata jsonb,
  attempted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index challenge_attempts_user_id_idx on public.challenge_attempts (user_id);
create index challenge_attempts_challenge_id_idx on public.challenge_attempts (challenge_id);
create index challenge_attempts_attempted_at_idx on public.challenge_attempts (attempted_at desc);

create trigger challenge_attempts_set_updated_at
before update on public.challenge_attempts
for each row execute function public.set_updated_at();

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null references public.badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index user_badges_user_id_idx on public.user_badges (user_id);

create trigger user_badges_set_updated_at
before update on public.user_badges
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Practice ledger & saved reports
-- ---------------------------------------------------------------------------

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  description text not null,
  transaction_id text,
  source text not null default 'practice'
    check (source in ('practice', 'year_end_adjustment', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index journal_entries_user_id_idx on public.journal_entries (user_id);
create index journal_entries_entry_date_idx on public.journal_entries (entry_date);

create trigger journal_entries_set_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

create table public.journal_entry_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries (id) on delete cascade,
  account_id text not null,
  debit_cents integer not null default 0 check (debit_cents >= 0),
  credit_cents integer not null default 0 check (credit_cents >= 0),
  memo text,
  line_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (debit_cents > 0 and credit_cents = 0)
    or (credit_cents > 0 and debit_cents = 0)
  )
);

create index journal_entry_lines_entry_id_idx on public.journal_entry_lines (journal_entry_id);

create trigger journal_entry_lines_set_updated_at
before update on public.journal_entry_lines
for each row execute function public.set_updated_at();

create table public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  report_type text not null
    check (report_type in ('trial_balance', 'profit_and_loss', 'balance_sheet', 'insights')),
  title text not null,
  as_of_date date,
  period_start date,
  period_end date,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index saved_reports_user_id_idx on public.saved_reports (user_id);
create index saved_reports_report_type_idx on public.saved_reports (report_type);

create trigger saved_reports_set_updated_at
before update on public.saved_reports
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.challenges enable row level security;
alter table public.badges enable row level security;
alter table public.user_progress enable row level security;
alter table public.challenge_attempts enable row level security;
alter table public.user_badges enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_entry_lines enable row level security;
alter table public.saved_reports enable row level security;

-- Catalog: authenticated users can read published content
create policy "courses_read_published"
on public.courses for select
to authenticated
using (is_published = true);

create policy "modules_read_published_course"
on public.modules for select
to authenticated
using (
  exists (
    select 1 from public.courses c
    where c.id = modules.course_id and c.is_published = true
  )
);

create policy "lessons_read_published_module"
on public.lessons for select
to authenticated
using (
  exists (
    select 1
    from public.modules m
    join public.courses c on c.id = m.course_id
    where m.id = lessons.module_id and c.is_published = true
  )
);

create policy "challenges_read_published_module"
on public.challenges for select
to authenticated
using (
  exists (
    select 1
    from public.modules m
    join public.courses c on c.id = m.course_id
    where m.id = challenges.module_id and c.is_published = true
  )
);

create policy "badges_read_all"
on public.badges for select
to authenticated
using (true);

-- Profiles: users manage their own row
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- User progress: own row only
create policy "user_progress_select_own"
on public.user_progress for select
to authenticated
using (auth.uid() = user_id);

create policy "user_progress_insert_own"
on public.user_progress for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_progress_update_own"
on public.user_progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Challenge attempts: own rows only
create policy "challenge_attempts_select_own"
on public.challenge_attempts for select
to authenticated
using (auth.uid() = user_id);

create policy "challenge_attempts_insert_own"
on public.challenge_attempts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "challenge_attempts_update_own"
on public.challenge_attempts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "challenge_attempts_delete_own"
on public.challenge_attempts for delete
to authenticated
using (auth.uid() = user_id);

-- User badges: own rows only
create policy "user_badges_select_own"
on public.user_badges for select
to authenticated
using (auth.uid() = user_id);

create policy "user_badges_insert_own"
on public.user_badges for insert
to authenticated
with check (auth.uid() = user_id);

-- Journal entries: own rows only
create policy "journal_entries_select_own"
on public.journal_entries for select
to authenticated
using (auth.uid() = user_id);

create policy "journal_entries_insert_own"
on public.journal_entries for insert
to authenticated
with check (auth.uid() = user_id);

create policy "journal_entries_update_own"
on public.journal_entries for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "journal_entries_delete_own"
on public.journal_entries for delete
to authenticated
using (auth.uid() = user_id);

-- Journal lines: via parent entry ownership
create policy "journal_entry_lines_select_own"
on public.journal_entry_lines for select
to authenticated
using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_lines.journal_entry_id
      and je.user_id = auth.uid()
  )
);

create policy "journal_entry_lines_insert_own"
on public.journal_entry_lines for insert
to authenticated
with check (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_lines.journal_entry_id
      and je.user_id = auth.uid()
  )
);

create policy "journal_entry_lines_update_own"
on public.journal_entry_lines for update
to authenticated
using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_lines.journal_entry_id
      and je.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_lines.journal_entry_id
      and je.user_id = auth.uid()
  )
);

create policy "journal_entry_lines_delete_own"
on public.journal_entry_lines for delete
to authenticated
using (
  exists (
    select 1 from public.journal_entries je
    where je.id = journal_entry_lines.journal_entry_id
      and je.user_id = auth.uid()
  )
);

-- Saved reports: own rows only
create policy "saved_reports_select_own"
on public.saved_reports for select
to authenticated
using (auth.uid() = user_id);

create policy "saved_reports_insert_own"
on public.saved_reports for insert
to authenticated
with check (auth.uid() = user_id);

create policy "saved_reports_update_own"
on public.saved_reports for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "saved_reports_delete_own"
on public.saved_reports for delete
to authenticated
using (auth.uid() = user_id);
