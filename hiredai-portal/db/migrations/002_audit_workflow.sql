alter table jobs add column if not exists department text;
alter table jobs add column if not exists location text;
alter table jobs add column if not exists openings integer;
alter table jobs add column if not exists application_deadline date;
alter table jobs add column if not exists skills text[] not null default '{}';
alter table jobs add column if not exists screening_questions jsonb not null default '[]'::jsonb;

alter table applications add column if not exists screening_answers jsonb not null default '[]'::jsonb;

alter table interviews add column if not exists interview_type text;
alter table interviews add column if not exists notes text;
alter table interviews add column if not exists updated_at timestamptz not null default now();
alter table interviews add column if not exists feedback jsonb;

alter table companies add column if not exists verification_requested boolean not null default false;

create table if not exists activity_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  application_id uuid references applications(id) on delete cascade,
  actor_id uuid references users(id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  message text not null,
  target_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists team_invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  email citext not null,
  name text,
  role text not null default 'recruiter',
  status text not null default 'invited',
  invited_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_company_created on activity_events(company_id, created_at desc);
create index if not exists idx_activity_application_created on activity_events(application_id, created_at desc);
create index if not exists idx_notifications_user_created on notifications(user_id, created_at desc);
create index if not exists idx_team_company_created on team_invitations(company_id, created_at desc);

create or replace function set_interview_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_interviews_updated_at on interviews;
create trigger trg_interviews_updated_at
before update on interviews
for each row execute function set_interview_updated_at();
