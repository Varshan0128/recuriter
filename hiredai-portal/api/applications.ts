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

  const url = new URL(req.url ?? '', 'http://localhost')
  const companyId = url.searchParams.get('company_id')

  try {
    const result = await query(
      `select
         applications.id,
         applications.job_id,
         applications.candidate_id,
         applications.status,
         applications.applied_at,
         candidates.name as candidate_name,
         candidates.email as candidate_email,
         candidates.phone as candidate_phone,
         candidates.resume_url,
         jobs.title as job_title,
         jobs.company_id
       from applications
       join candidates on candidates.id = applications.candidate_id
       join jobs on jobs.id = applications.job_id
       where ($1::uuid is null or jobs.company_id = $1::uuid)
       order by applications.applied_at desc`,
      [companyId],
    )
    json(res, 200, result.rows)
  } catch (error) {
    json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
  }
}
