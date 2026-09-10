create table if not exists interview_scorecards (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  interview_id uuid references interviews(id) on delete set null,
  overall_rating numeric(2,1) check (overall_rating between 1 and 5),
  technical_skills numeric(2,1) check (technical_skills between 1 and 5),
  communication numeric(2,1) check (communication between 1 and 5),
  problem_solving numeric(2,1) check (problem_solving between 1 and 5),
  role_fit numeric(2,1) check (role_fit between 1 and 5),
  strengths text,
  concerns text,
  recommendation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (application_id)
);

create table if not exists application_evaluations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  evaluate_status text not null default 'pending',
  ai_score numeric(5,2),
  fit_summary text,
  rationale text,
  recruiter_decision text,
  override_score numeric(5,2),
  reviewer text,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (application_id)
);

create index if not exists idx_scorecards_application on interview_scorecards(application_id);
create index if not exists idx_evaluations_application on application_evaluations(application_id);

create or replace function set_scorecard_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_interview_scorecards_updated_at on interview_scorecards;
create trigger trg_interview_scorecards_updated_at
before update on interview_scorecards
for each row execute function set_scorecard_updated_at();

drop trigger if exists trg_application_evaluations_updated_at on application_evaluations;
create trigger trg_application_evaluations_updated_at
before update on application_evaluations
for each row execute function set_scorecard_updated_at();
