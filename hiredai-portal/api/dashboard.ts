import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { json, methodNotAllowed } from './_lib/http.js'

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

  const companyId = new URL(req.url ?? '', 'http://localhost').searchParams.get('company_id')
  if (!companyId) {
    json(res, 400, { error: 'company_id is required' })
    return
  }

  try {
    const result = await query<{ active_jobs: string; applications: string; interviews: string; hired: string }>(
      `select
         (select count(*) from jobs where company_id = $1 and status = 'published') as active_jobs,
         (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1) as applications,
         (select count(*) from interviews join applications on applications.id = interviews.application_id join jobs on jobs.id = applications.job_id where jobs.company_id = $1) as interviews,
         (select count(*) from applications join jobs on jobs.id = applications.job_id where jobs.company_id = $1 and applications.status = 'hired') as hired`,
      [companyId],
    )
    const row = result.rows[0]
    json(res, 200, Object.fromEntries(Object.entries(row).map(([key, value]) => [key, Number(value)])))
  } catch (error) {
    json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
  }
}