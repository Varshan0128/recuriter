import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { json, methodNotAllowed } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }
  if (req.method !== 'GET') { methodNotAllowed(res, ['GET', 'OPTIONS']); return }
  const url = new URL(req.url ?? '', 'http://localhost')
  const applicationId = url.searchParams.get('application_id')
  if (!applicationId) { json(res, 400, { error: 'application_id is required' }); return }
  try {
    const result = await query(`select activity_events.*, users.name as actor_name from activity_events left join users on users.id = activity_events.actor_id where application_id = $1 order by created_at desc`, [applicationId])
    json(res, 200, result.rows)
  } catch (error) { json(res, 500, { error: error instanceof Error ? error.message : 'Unable to load activity' }) }
}
