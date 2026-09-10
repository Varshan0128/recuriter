import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { badRequest, json, methodNotAllowed, readJsonBody } from './_lib/http.js'

const ALLOWED_RECOMMENDATIONS = ['Strong Hire', 'Hire', 'Maybe', 'No Hire', 'Strong No Hire']

function isValidRating(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5
}

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
        `select * from interview_scorecards where application_id = $1 order by updated_at desc nulls last, created_at desc`,
        [applicationId],
      )
      json(res, 200, result.rows)
      return
    } catch (error) {
      json(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' })
    }
    return
  }

  if (req.method === 'POST' || req.method === 'PATCH') {
    try {
      const body = (await readJsonBody(req)) as Record<string, unknown>
      const payloadId = typeof body.id === 'string' ? body.id : id
      const targetApplicationId = typeof body.application_id === 'string' ? body.application_id : applicationId
      if (!targetApplicationId) {
        badRequest(res, 'application_id is required')
        return
      }

      const values = {
        application_id: targetApplicationId,
        interview_id: typeof body.interview_id === 'string' ? body.interview_id : null,
        overall_rating: body.overall_rating,
        technical_skills: body.technical_skills,
        communication: body.communication,
        problem_solving: body.problem_solving,
        role_fit: body.role_fit,
        strengths: typeof body.strengths === 'string' ? body.strengths.trim() : null,
        concerns: typeof body.concerns === 'string' ? body.concerns.trim() : null,
        recommendation: typeof body.recommendation === 'string' && ALLOWED_RECOMMENDATIONS.includes(body.recommendation) ? body.recommendation : null,
      }

      if (values.overall_rating !== null && !isValidRating(values.overall_rating)) {
        badRequest(res, 'overall_rating must be between 1 and 5')
        return
      }
      if (values.technical_skills !== null && !isValidRating(values.technical_skills)) {
        badRequest(res, 'technical_skills must be between 1 and 5')
        return
      }
      if (values.communication !== null && !isValidRating(values.communication)) {
        badRequest(res, 'communication must be between 1 and 5')
        return
      }
      if (values.problem_solving !== null && !isValidRating(values.problem_solving)) {
        badRequest(res, 'problem_solving must be between 1 and 5')
        return
      }
      if (values.role_fit !== null && !isValidRating(values.role_fit)) {
        badRequest(res, 'role_fit must be between 1 and 5')
        return
      }

      if (req.method === 'PATCH' && !payloadId) {
        badRequest(res, 'id is required for updates')
        return
      }

      if (req.method === 'POST') {
        const existing = await query('select id from interview_scorecards where application_id = $1 limit 1', [targetApplicationId])
        if (existing.rowCount > 0) {
          badRequest(res, 'A scorecard already exists for this application. Edit it instead.')
          return
        }

        const result = await query(
          `insert into interview_scorecards (
            application_id, interview_id, overall_rating, technical_skills, communication,
            problem_solving, role_fit, strengths, concerns, recommendation
          ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *`,
          [
            values.application_id,
            values.interview_id,
            values.overall_rating,
            values.technical_skills,
            values.communication,
            values.problem_solving,
            values.role_fit,
            values.strengths,
            values.concerns,
            values.recommendation,
          ],
        )
        json(res, 201, result.rows[0])
        return
      }

      const updates: string[] = []
      const updateValues: unknown[] = []
      const updateMap = [
        ['interview_id', values.interview_id],
        ['overall_rating', values.overall_rating],
        ['technical_skills', values.technical_skills],
        ['communication', values.communication],
        ['problem_solving', values.problem_solving],
        ['role_fit', values.role_fit],
        ['strengths', values.strengths],
        ['concerns', values.concerns],
        ['recommendation', values.recommendation],
      ]

      for (const [field, value] of updateMap) {
        if (value !== undefined) {
          updates.push(`${field} = $${updateValues.length + 1}`)
          updateValues.push(value)
        }
      }

      if (updates.length === 0) {
        badRequest(res, 'No scorecard fields provided')
        return
      }

      updateValues.push(payloadId)
      const result = await query(`update interview_scorecards set ${updates.join(', ')} where id = $${updateValues.length} returning *`, updateValues)
      if (result.rowCount === 0) {
        json(res, 404, { error: 'Scorecard not found' })
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
