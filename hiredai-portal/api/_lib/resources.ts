export const jobCreateFields = [
  'company_id',
  'title',
  'description',
  'employment_type',
  'work_mode',
  'experience_min',
  'experience_max',
  'salary_min',
  'salary_max',
  'salary_currency',
  'status',
  'created_by',
] as const

export const jobUpdateFields = [
  'company_id',
  'title',
  'description',
  'employment_type',
  'work_mode',
  'experience_min',
  'experience_max',
  'salary_min',
  'salary_max',
  'salary_currency',
  'status',
  'created_by',
] as const

export const applicationFields = ['job_id', 'candidate_id', 'status'] as const
export const interviewFields = ['application_id', 'scheduled_at', 'interviewer_id', 'meeting_url', 'status'] as const
export const companyFields = ['name', 'logo_url', 'description', 'industry', 'website', 'company_size', 'headquarters', 'verified'] as const
export const candidateFields = ['name', 'email', 'phone', 'resume_url'] as const
export const noteFields = ['application_id', 'author_id', 'content'] as const

