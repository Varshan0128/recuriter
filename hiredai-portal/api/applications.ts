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
      const companyId = url.searchParams.get('company_id') ?? (typeof body.company_id === 'string' ? body.company_id : null)
      const allowedStatuses = ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired']
      if (!id.trim() || !allowedStatuses.includes(status)) {
        badRequest(res, 'A valid id and status are required')
        return
      }

      if (companyId) {
        const ownership = await query(
          `select applications.id from applications join jobs on jobs.id = applications.job_id where applications.id = $1 and jobs.company_id = $2 limit 1`,
          [id.trim(), companyId],
        )
        if (ownership.rowCount === 0) {
          json(res, 403, { error: 'Application does not belong to this company' })
          return
        }
      }

      const result = await query('update applications set status = $1 where id = $2 returning *', [status, id.trim()])
      if (result.rowCount === 0) {
        json(res, 404, { error: 'Application not found' })
        return
      }
      const context = await query<{ company_id: string; title: string; candidate_name: string }>(
        `select jobs.company_id, jobs.title, candidates.name as candidate_name from applications join jobs on jobs.id = applications.job_id join candidates on candidates.id = applications.candidate_id where applications.id = $1`,
        [id.trim()],
      )
      const event = context.rows[0]
      if (event) {
        await query(`insert into activity_events (company_id, application_id, event_type, details) values ($1, $2, $3, $4::jsonb)`, [event.company_id, id.trim(), status, JSON.stringify({ candidate_name: event.candidate_name, job_title: event.title })])
        await query(`insert into notifications (company_id, user_id, title, message, target_path) select company_id, id, $2, $3, $4 from users where company_id = $1`, [event.company_id, 'Candidate status updated', `${event.candidate_name} moved to ${status}.`, '/hr/applications'])
      }
      json(res, 200, result.rows[0])
      return
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
         jobs.company_id,
         applications.screening_answers,
         candidates.resume_url
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
