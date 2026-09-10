import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { json, methodNotAllowed, readJsonBody } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }
  const url = new URL(req.url ?? '', 'http://localhost')
  const queryCompanyId = url.searchParams.get('company_id')
  try {
    if (req.method === 'GET') {
      if (!queryCompanyId) { json(res, 400, { error: 'company_id is required' }); return }
      const result = await query(`
        select id, name, email, role, 'member' as status, created_at from users where company_id = $1
        union all
        select id, name, email, role, status, created_at from team_invitations where company_id = $1
        order by created_at desc`, [queryCompanyId])
      json(res, 200, result.rows); return
    }
    if (req.method === 'POST') {
      const body = await readJsonBody(req)
      const companyId = url.searchParams.get('company_id') ?? (typeof body.company_id === 'string' ? body.company_id : '')
      if (!companyId) { json(res, 400, { error: 'company_id is required' }); return }
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      const role = typeof body.role === 'string' ? body.role : 'recruiter'
      if (!email || !['recruiter', 'hiring manager', 'admin'].includes(role.toLowerCase())) { json(res, 400, { error: 'Valid email and role are required' }); return }
      const result = await query(`insert into team_invitations (company_id, email, name, role, invited_by) values ($1, $2, $3, $4, $5) returning *`, [companyId, email, typeof body.name === 'string' ? body.name : null, role, typeof body.invited_by === 'string' ? body.invited_by : null])
      json(res, 201, result.rows[0]); return
    }
    const companyId = queryCompanyId
    if (!companyId) { json(res, 400, { error: 'company_id is required' }); return }
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id')
      if (!id) { json(res, 400, { error: 'id is required' }); return }
      await query('delete from team_invitations where id = $1 and company_id = $2', [id, companyId])
      json(res, 200, { ok: true }); return
    }
    methodNotAllowed(res, ['GET', 'POST', 'DELETE', 'OPTIONS'])
  } catch (error) { json(res, 500, { error: error instanceof Error ? error.message : 'Unable to manage team' }) }
}
