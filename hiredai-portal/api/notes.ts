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
  const applicationId = url.searchParams.get('application_id')

  if (req.method === 'GET') {
    if (!applicationId) {
      badRequest(res, 'application_id is required')
      return
    }
    try {
      const result = await query('select notes.*, users.name as author_name from notes left join users on users.id = notes.author_id where application_id = $1 order by created_at desc', [applicationId])
      json(res, 200, result.rows)
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Unable to load notes' })
    }
    return
  }

  if (req.method === 'POST') {
    try {
      const body = (await readJsonBody(req)) as Record<string, unknown>
      const targetApplicationId = typeof body.application_id === 'string' ? body.application_id : applicationId
      const authorId = typeof body.author_id === 'string' ? body.author_id : null
      const content = typeof body.content === 'string' ? body.content.trim() : ''

      if (!targetApplicationId || !content) {
        badRequest(res, 'application_id and content are required')
        return
      }

      const insert = await query(
        'insert into notes (application_id, author_id, content) values ($1, $2, $3) returning *',
        [targetApplicationId, authorId, content],
      )

      const context = await query<{ company_id: string; candidate_name: string; job_title: string }>(
        `select jobs.company_id, candidates.name as candidate_name, jobs.title as job_title
         from applications
         join jobs on jobs.id = applications.job_id
         join candidates on candidates.id = applications.candidate_id
         where applications.id = $1`,
        [targetApplicationId],
      )

      if (context.rows[0]) {
        await query(
          `insert into activity_events (company_id, application_id, actor_id, event_type, details)
           values ($1, $2, $3, 'note_added', $4::jsonb)`,
          [
            context.rows[0].company_id,
            targetApplicationId,
            authorId,
            JSON.stringify({ candidate_name: context.rows[0].candidate_name, job_title: context.rows[0].job_title, note_preview: content.slice(0, 120) }),
          ],
        )
      }

      json(res, 201, insert.rows[0])
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
    }
    return
  }

  methodNotAllowed(res, ['GET', 'POST', 'OPTIONS'])
}
