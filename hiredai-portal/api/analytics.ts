import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { json, methodNotAllowed } from './_lib/http.js'

const STAGE_COLORS: Record<string, string> = {
  applied: '#8b5cf6',
  reviewed: '#06b6d4',
  shortlisted: '#a855f7',
  interview: '#f59e0b',
  rejected: '#ef4444',
  hired: '#10b981',
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET', 'OPTIONS'])
    return
  }

  const url = new URL(req.url ?? '', 'http://localhost')
  const companyId = url.searchParams.get('company_id')

  if (!companyId) {
    json(res, 400, { error: 'company_id is required' })
    return
  }

  try {
    const metricsQuery = await query<{ total_jobs: string; active_jobs: string; closed_jobs: string; total_applications: string; reviewed: string; shortlisted: string; interviews: string; rejected: string; hired: string }>(`
      select
        (select count(*) from jobs where company_id = $1) as total_jobs,
        (select count(*) from jobs where company_id = $1 and status = 'published') as active_jobs,
        (select count(*) from jobs where company_id = $1 and status = 'closed') as closed_jobs,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1) as total_applications,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'reviewed') as reviewed,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'shortlisted') as shortlisted,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'interview') as interviews,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'rejected') as rejected,
        (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'hired') as hired
    `, [companyId])

    const byStageQuery = await query<{ stage: string; value: string }>(`
      select status as stage, count(*)::int as value
      from applications
      join jobs on jobs.id = applications.job_id
      where jobs.company_id = $1
      group by status
      order by case status
        when 'applied' then 1
        when 'reviewed' then 2
        when 'shortlisted' then 3
        when 'interview' then 4
        when 'rejected' then 5
        when 'hired' then 6
        else 7
      end
    `, [companyId])

    const byJobQuery = await query<{ name: string; applications: string }>(`
      select jobs.title as name, count(applications.id)::int as applications
      from jobs
      left join applications on applications.job_id = jobs.id
      where jobs.company_id = $1
      group by jobs.id, jobs.title
      order by applications desc, jobs.title asc
    `, [companyId])

    const trendsQuery = await query<{ label: string; applications: string; interviews: string; hired: string }>(`
      select to_char(applications.applied_at at time zone 'UTC', 'Mon DD') as label,
             count(*)::int as applications,
             sum(case when applications.status = 'interview' then 1 else 0 end)::int as interviews,
             sum(case when applications.status = 'hired' then 1 else 0 end)::int as hired
      from applications
      join jobs on jobs.id = applications.job_id
      where jobs.company_id = $1
      group by to_char(applications.applied_at at time zone 'UTC', 'Mon DD'), date(applications.applied_at)
      order by date(applications.applied_at) asc
      limit 7
    `, [companyId])

    const metrics = metricsQuery.rows[0] ?? {
      total_jobs: '0', active_jobs: '0', closed_jobs: '0', total_applications: '0', reviewed: '0', shortlisted: '0', interviews: '0', rejected: '0', hired: '0',
    }

    json(res, 200, {
      metrics: {
        total_jobs: Number(metrics.total_jobs),
        active_jobs: Number(metrics.active_jobs),
        closed_jobs: Number(metrics.closed_jobs),
        total_applications: Number(metrics.total_applications),
        reviewed: Number(metrics.reviewed),
        shortlisted: Number(metrics.shortlisted),
        interviews: Number(metrics.interviews),
        rejected: Number(metrics.rejected),
        hired: Number(metrics.hired),
      },
      by_stage: byStageQuery.rows.map((row) => ({ stage: row.stage, value: Number(row.value), color: STAGE_COLORS[row.stage] ?? '#94a3b8' })),
      by_job: byJobQuery.rows.map((row) => ({ name: row.name, applications: Number(row.applications) })),
      trends: trendsQuery.rows.map((row) => ({
        label: row.label,
        applications: Number(row.applications),
        interviews: Number(row.interviews),
        hired: Number(row.hired),
      })),
    })
  } catch (error) {
    json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
