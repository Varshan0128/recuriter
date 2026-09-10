import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { json, methodNotAllowed, readJsonBody } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }
  const url = new URL(req.url ?? '', 'http://localhost')
  const userId = url.searchParams.get('user_id')
  if (!userId) { json(res, 400, { error: 'user_id is required' }); return }
  try {
    if (req.method === 'GET') {
      const result = await query(`select * from notifications where user_id = $1 order by created_at desc limit 100`, [userId])
      json(res, 200, result.rows); return
    }
    if (req.method === 'PATCH') {
      const body = await readJsonBody(req)
      const id = url.searchParams.get('id') ?? (typeof body.id === 'string' ? body.id : null)
      if (id) {
        await query('update notifications set read_at = coalesce(read_at, now()) where id = $1 and user_id = $2', [id, userId])
      } else if (body.mark_all_read === true) {
        await query('update notifications set read_at = coalesce(read_at, now()) where user_id = $1', [userId])
      }
      json(res, 200, { ok: true }); return
    }
    methodNotAllowed(res, ['GET', 'PATCH', 'OPTIONS'])
  } catch (error) { json(res, 500, { error: error instanceof Error ? error.message : 'Unable to load notifications' }) }
}
