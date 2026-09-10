import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { badRequest, json, methodNotAllowed, readJsonBody } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url ?? '', 'http://localhost')
  const companyId = url.searchParams.get('company_id')
  const id = url.searchParams.get('id')

  if (req.method === 'GET') {
    if (companyId) {
      try {
        const result = await query(
          `select interviews.*, candidates.name as candidate_name, jobs.title as job_title from interviews join applications on applications.id = interviews.application_id join candidates on candidates.id = applications.candidate_id join jobs on jobs.id = applications.job_id where jobs.company_id = $1 order by scheduled_at asc`,
          [companyId],
        )
        json(res, 200, result.rows)
      } catch (error) {
        json(res, 500, { error: error instanceof Error ? error.message : 'Unable to load interviews' })
      }
      return
    }

    if (id) {
      try {
        const result = await query('select * from interviews where id = $1 limit 1', [id])
        if (result.rowCount === 0) {
          json(res, 404, { error: 'Interview not found' })
          return
        }
        json(res, 200, result.rows[0])
      } catch (error) {
        json(res, 500, { error: error instanceof Error ? error.message : 'Unable to load interview' })
      }
      return
    }

    badRequest(res, 'company_id or id is required')
    return
  }

  if (req.method === 'POST') {
    try {
      const body = (await readJsonBody(req)) as Record<string, unknown>
      const applicationId = typeof body.application_id === 'string' ? body.application_id : ''
      const scheduledAt = typeof body.scheduled_at === 'string' ? body.scheduled_at : ''
      if (!applicationId || !scheduledAt) {
        badRequest(res, 'application_id and scheduled_at are required')
        return
      }
      const result = await query(
        `insert into interviews (application_id, scheduled_at, interviewer_id, meeting_url, status, interview_type, notes)
         values ($1, $2::timestamptz, $3, $4, 'scheduled', $5, $6) returning *`,
        [applicationId, scheduledAt, typeof body.interviewer_id === 'string' ? body.interviewer_id : null, typeof body.meeting_url === 'string' ? body.meeting_url : null, typeof body.interview_type === 'string' ? body.interview_type : 'video', typeof body.notes === 'string' ? body.notes : null],
      )

      const context = await query<{ company_id: string; candidate_name: string; job_title: string }>(
        `select jobs.company_id, candidates.name as candidate_name, jobs.title as job_title
         from applications
         join jobs on jobs.id = applications.job_id
         join candidates on candidates.id = applications.candidate_id
         where applications.id = $1`,
        [applicationId],
      )

      if (context.rows[0]) {
        await query(
          `insert into activity_events (company_id, application_id, actor_id, event_type, details)
           values ($1, $2, $3, 'interview_scheduled', $4::jsonb)`,
          [context.rows[0].company_id, applicationId, typeof body.interviewer_id === 'string' ? body.interviewer_id : null, JSON.stringify({ candidate_name: context.rows[0].candidate_name, job_title: context.rows[0].job_title, scheduled_at: scheduledAt })],
        )
      }

      json(res, 201, result.rows[0])
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Unable to create interview' })
    }
    return
  }

  if (req.method === 'PATCH') {
    try {
      const body = (await readJsonBody(req)) as Record<string, unknown>
      const targetId = typeof body.id === 'string' ? body.id : id
      if (!targetId) {
        badRequest(res, 'id is required')
        return
      }

      const fields: Array<string> = []
      const values: unknown[] = []
      const updates: Array<[string, unknown]> = [
        ['scheduled_at', typeof body.scheduled_at === 'string' ? body.scheduled_at : undefined],
        ['interviewer_id', typeof body.interviewer_id === 'string' ? body.interviewer_id : undefined],
        ['meeting_url', typeof body.meeting_url === 'string' ? body.meeting_url : undefined],
        ['status', typeof body.status === 'string' ? body.status : undefined],
        ['interview_type', typeof body.interview_type === 'string' ? body.interview_type : undefined],
        ['notes', typeof body.notes === 'string' ? body.notes : undefined],
      ]

      for (const [field, value] of updates) {
        if (value !== undefined) {
          fields.push(`${field} = $${values.length + 1}`)
          values.push(value)
        }
      }

      if (fields.length === 0) {
        badRequest(res, 'No interview fields provided')
        return
      }

      values.push(targetId)
      const result = await query(`update interviews set ${fields.join(', ')} where id = $${values.length} returning *`, values)
      if (result.rowCount === 0) {
        json(res, 404, { error: 'Interview not found' })
        return
      }

      const interview = result.rows[0]
      const context = await query<{ company_id: string; candidate_name: string; job_title: string }>(
        `select jobs.company_id, candidates.name as candidate_name, jobs.title as job_title
         from interviews
         join applications on applications.id = interviews.application_id
         join jobs on jobs.id = applications.job_id
         join candidates on candidates.id = applications.candidate_id
         where interviews.id = $1`,
        [targetId],
      )

      if (context.rows[0]) {
        const eventType = interview.status === 'cancelled' ? 'interview_cancelled' : interview.status === 'completed' ? 'interview_completed' : 'interview_rescheduled'
        await query(
          `insert into activity_events (company_id, application_id, actor_id, event_type, details)
           values ($1, $2, $3, $4, $5::jsonb)`,
          [context.rows[0].company_id, interview.application_id, interview.interviewer_id, eventType, JSON.stringify({ candidate_name: context.rows[0].candidate_name, job_title: context.rows[0].job_title, scheduled_at: interview.scheduled_at })],
        )
      }

      json(res, 200, interview)
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Unable to update interview' })
    }
    return
  }

  methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'OPTIONS'])
}
