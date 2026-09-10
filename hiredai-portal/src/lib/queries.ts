import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../auth/AuthContext'
import { apiRequest, queryString } from './api'

export type Job = {
  id: string
  company_id: string
  title: string
  description: string
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  work_mode: 'remote' | 'hybrid' | 'onsite'
  experience_min: number | null
  experience_max: number | null
  salary_min: string | null
  salary_max: string | null
  salary_currency: string
  status: 'draft' | 'published' | 'paused' | 'closed'
  created_by: string | null
  created_at: string
  screening_questions?: Array<{ question: string } | string>
}

export type Note = {
  id: string
  application_id: string
  author_id: string | null
  content: string
  created_at: string
}

export type Application = {
  id: string
  job_id: string
  candidate_id: string
  status: 'applied' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'hired'
  applied_at: string
  candidate_name: string
  candidate_email: string
  candidate_phone: string | null
  resume_url: string | null
  job_title: string
  company_id: string
  screening_answers: unknown[]
}

export type Interview = {
  id: string
  application_id: string
  scheduled_at: string
  interviewer_id: string | null
  meeting_url: string | null
  status: 'scheduled' | 'completed' | 'cancelled'
  interview_type: string | null
  notes: string | null
  feedback: Record<string, unknown> | null
  candidate_name: string
  job_title: string
}

export type Notification = { id: string; title: string; message: string; target_path: string | null; read_at: string | null; created_at: string }

export type ActivityItem = {
  id: string
  event_type: string
  details: Record<string, unknown>
  actor_name: string | null
  created_at: string
}

export type InterviewScorecard = {
  id: string
  interview_id: string
  application_id: string
  overall_rating: number | null
  technical_skills: number | null
  communication: number | null
  problem_solving: number | null
  role_fit: number | null
  strengths: string | null
  concerns: string | null
  recommendation: string | null
  created_at: string
  updated_at: string
}

export type ApplicationEvaluation = {
  id: string
  application_id: string
  evaluate_status: string
  ai_score: number | null
  fit_summary: string | null
  rationale: string | null
  recruiter_decision: string | null
  override_score: number | null
  reviewer: string | null
  reason: string | null
  created_at: string
  updated_at: string
}

export type Company = {
  id: string
  name: string
  logo_url: string | null
  description: string | null
  industry: string | null
  website: string | null
  company_size: string | null
  headquarters: string | null
  verified: boolean
}

function useCurrentUser() {
  return useAuth().user
}

export function useCompanyId() {
  return useCurrentUser()?.company_id ?? null
}

export function useJobs() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['jobs', companyId],
    queryFn: () => apiRequest<Job[]>(`/api/jobs${queryString({ company_id: companyId })}`),
    enabled: Boolean(companyId),
  })
}

export function useApplications() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['applications', companyId],
    queryFn: () => apiRequest<Application[]>(`/api/applications${queryString({ company_id: companyId })}`),
    enabled: Boolean(companyId),
  })
}

export function useDashboardStats() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['dashboard', companyId],
    queryFn: () => apiRequest<{ active_jobs: number; applications: number; interviews: number; hired: number }>(`/api/dashboard${queryString({ company_id: companyId })}`),
    enabled: Boolean(companyId),
  })
}

export type AnalyticsResponse = {
  metrics: {
    total_jobs: number
    active_jobs: number
    closed_jobs: number
    total_applications: number
    reviewed: number
    shortlisted: number
    interviews: number
    rejected: number
    hired: number
  }
  by_stage: Array<{ stage: string; value: number; color: string }>
  by_job: Array<{ name: string; applications: number }>
  trends: Array<{ label: string; applications: number; interviews: number; hired: number }>
}

export function useAnalytics() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['analytics', companyId],
    queryFn: () => apiRequest<AnalyticsResponse>(`/api/analytics${queryString({ company_id: companyId })}`),
    enabled: Boolean(companyId),
  })
}

export function useCompany() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => apiRequest<Company>(`/api/companies?id=${companyId}`),
    enabled: Boolean(companyId),
  })
}

export function usePreferences() {
  const userId = useCurrentUser()?.id ?? null
  return useQuery({
    queryKey: ['preferences', userId],
    queryFn: () => apiRequest<Record<string, unknown>>(`/api/settings${queryString({ user_id: userId })}`),
    enabled: Boolean(userId),
  })
}

export function useJob(jobId: string | null) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => apiRequest<Job>(`/api/jobs${queryString({ id: jobId })}`),
    enabled: Boolean(jobId),
  })
}

export function useNotes(applicationId: string | null) {
  return useQuery({
    queryKey: ['notes', applicationId],
    queryFn: () => apiRequest<Note[]>(`/api/notes${queryString({ application_id: applicationId })}`),
    enabled: Boolean(applicationId),
  })
}

export function useActivity(applicationId: string | null) {
  return useQuery({
    queryKey: ['activity', applicationId],
    queryFn: () => apiRequest<ActivityItem[]>(`/api/activity${queryString({ application_id: applicationId })}`),
    enabled: Boolean(applicationId),
  })
}

export function useInterviewScorecards(applicationId: string | null) {
  return useQuery({
    queryKey: ['scorecards', applicationId],
    queryFn: () => apiRequest<InterviewScorecard[]>(`/api/scorecards${queryString({ application_id: applicationId })}`),
    enabled: Boolean(applicationId),
  })
}

export function useApplicationEvaluation(applicationId: string | null) {
  return useQuery({
    queryKey: ['evaluations', applicationId],
    queryFn: () => apiRequest<ApplicationEvaluation[]>(`/api/evaluations${queryString({ application_id: applicationId })}`),
    enabled: Boolean(applicationId),
  })
}

export function useInterviews() {
  const companyId = useCompanyId()
  return useQuery({
    queryKey: ['interviews', companyId],
    queryFn: () => apiRequest<Interview[]>(`/api/interviews?company_id=${companyId}`),
    enabled: Boolean(companyId),
  })
}

export function useNotifications() {
  const userId = useCurrentUser()?.id ?? null
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => apiRequest<Notification[]>(`/api/notifications${queryString({ user_id: userId })}`),
    enabled: Boolean(userId),
  })
}