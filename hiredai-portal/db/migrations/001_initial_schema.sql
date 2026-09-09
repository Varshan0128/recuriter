create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'employment_type') then
    create type employment_type as enum ('full-time', 'part-time', 'contract', 'internship');
  end if;

  if not exists (select 1 from pg_type where typname = 'work_mode') then
    create type work_mode as enum ('remote', 'hybrid', 'onsite');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type job_status as enum ('draft', 'published', 'paused', 'closed');
  end if;

  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum ('applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired');
  end if;

  if not exists (select 1 from pg_type where typname = 'interview_status') then
    create type interview_status as enum ('scheduled', 'completed', 'cancelled');
  end if;
end $$;

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  description text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null unique,
  password_hash text not null,
  role text not null default 'recruiter',
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  title text not null,
  description text not null,
  employment_type employment_type not null,
  work_mode work_mode not null,
  experience_min integer,
  experience_max integer,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  salary_currency text not null default 'USD',
  status job_status not null default 'draft',
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_experience_range check (
    experience_min is null
    or experience_max is null
    or experience_min <= experience_max
  ),
  constraint jobs_salary_range check (
    salary_min is null
    or salary_max is null
    or salary_min <= salary_max
  )
);

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null unique,
  phone text,
  resume_url text,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  status application_status not null default 'applied',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, candidate_id)
);

create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  scheduled_at timestamptz not null,
  interviewer_id uuid references users(id) on delete set null,
  meeting_url text,
  status interview_status not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  author_id uuid references users(id) on delete set null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_company_id on jobs(company_id);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_applications_job_id on applications(job_id);
create index if not exists idx_applications_candidate_id on applications(candidate_id);
create index if not exists idx_interviews_application_id on interviews(application_id);
create index if not exists idx_notes_application_id on notes(application_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_jobs_updated_at on jobs;
create trigger trg_jobs_updated_at
before update on jobs
for each row execute function set_updated_at();

drop trigger if exists trg_applications_updated_at on applications;
create trigger trg_applications_updated_at
before update on applications
for each row execute function set_updated_at();

