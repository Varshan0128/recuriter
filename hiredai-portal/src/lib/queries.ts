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