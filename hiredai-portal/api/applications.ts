import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { badRequest, json, methodNotAllowed, readJsonBody } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method === 'PATCH') {
    try {
      const body = (await readJsonBody(req)) as Record<string, unknown>
      const url = new URL(req.url ?? '', 'http://localhost')
      const id = url.searchParams.get('id') ?? (typeof body.id === 'string' ? body.id : '')
      const status = typeof body.status === 'string' ? body.status : ''
      const allowedStatuses = ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired']
      if (!id.trim() || !allowedStatuses.includes(status)) {
        badRequest(res, 'A valid id and status are required')
        return
      }

      const result = await query('update applications set status = $1 where id = $2 returning *', [status, id.trim()])
      if (result.rowCount === 0) {
        json(res, 404, { error: 'Application not found' })
        return
      }
      json(res, 200, result.rows[0])
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
    }
    return
  }

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET', 'PATCH', 'OPTIONS'])
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
