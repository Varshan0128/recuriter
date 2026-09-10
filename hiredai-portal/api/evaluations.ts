import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { badRequest, json, methodNotAllowed, readJsonBody } from './_lib/http.js'

const ALLOWED_DECISIONS = ['agree', 'disagree']
const ALLOWED_STATUS = ['pending', 'processing', 'completed', 'failed', 'manual_review']

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url ?? '', 'http://localhost')
  const applicationId = url.searchParams.get('application_id')
  const id = url.searchParams.get('id')

  if (req.method === 'GET') {
    if (!applicationId) {
      badRequest(res, 'application_id is required')
      return
    }
    try {
      const result = await query(
        `select * from application_evaluations where application_id = $1 order by created_at desc`,
        [applicationId],
      )
      json(res, 200, result.rows)
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
    }
    return
  }

  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const body = await readJsonBody(req)
      const payloadId = typeof body.id === 'string' ? body.id : id
      const currentApplicationId = typeof body.application_id === 'string' ? body.application_id : applicationId
      if (!currentApplicationId) {
        badRequest(res, 'application_id is required')
        return
      }

      const aiFields = ['ai_score', 'fit_summary', 'rationale']
      if (aiFields.some((field) => Object.prototype.hasOwnProperty.call(body, field))) {
        badRequest(res, 'AI evaluation fields are reserved for an evaluator service')
        return
      }

      const decision = typeof body.recruiter_decision === 'string' && ALLOWED_DECISIONS.includes(body.recruiter_decision) ? body.recruiter_decision : null
      const overrideScore = typeof body.override_score === 'number' ? body.override_score : null
      const reviewer = typeof body.reviewer === 'string' ? body.reviewer.trim() || null : null
      const reason = typeof body.reason === 'string' ? body.reason.trim() || null : null

      if (req.method === 'POST') {
        const result = await query(
          `insert into application_evaluations (
            application_id, evaluate_status, recruiter_decision,
            override_score, reviewer, reason
          ) values ($1, 'pending', $2, $3, $4, $5) returning *`,
          [
            currentApplicationId,
            decision,
            overrideScore,
            reviewer,
            reason,
          ],
        )
        json(res, 201, result.rows[0])
        return
      }

      if (!payloadId) {
        badRequest(res, 'id is required for updates')
        return
      }

      const updates: string[] = []
      const values: unknown[] = []
      const updateMap: Array<[string, unknown]> = [
        ['recruiter_decision', Object.prototype.hasOwnProperty.call(body, 'recruiter_decision') ? decision : undefined],
        ['override_score', Object.prototype.hasOwnProperty.call(body, 'override_score') ? overrideScore : undefined],
        ['reviewer', Object.prototype.hasOwnProperty.call(body, 'reviewer') ? reviewer : undefined],
        ['reason', Object.prototype.hasOwnProperty.call(body, 'reason') ? reason : undefined],
      ]

      for (const [field, value] of updateMap) {
        if (value !== undefined) {
          updates.push(`${field} = $${values.length + 1}`)
          values.push(value)
        }
      }

      if (updates.length === 0) {
        badRequest(res, 'No evaluation fields provided')
        return
      }

      values.push(payloadId)
      const result = await query(`update application_evaluations set ${updates.join(', ')} where id = $${values.length} returning *`, values)
      if (result.rowCount === 0) {
        json(res, 404, { error: 'Evaluation record not found' })
        return
      }
      json(res, 200, result.rows[0])
      return
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
    }
    return
  }

  methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'OPTIONS'])
}
