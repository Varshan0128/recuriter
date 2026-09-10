import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './_lib/db.js'
import { badRequest, json, methodNotAllowed } from './_lib/http.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url ?? '', 'http://localhost')
  const userId = url.searchParams.get('user_id')
  if (!userId) {
    badRequest(res, 'user_id is required')
    return
  }

  try {
    if (req.method === 'GET') {
      const result = await query<{ preferences: unknown }>('select preferences from users where id = $1 limit 1', [userId])
      if (!result.rows[0]) {
        json(res, 404, { error: 'User not found' })
        return
      }
      json(res, 200, result.rows[0].preferences ?? {})
      return
    }

    if (req.method === 'PUT') {
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      const preferences = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      const result = await query<{ preferences: unknown }>(
        'update users set preferences = $1::jsonb where id = $2 returning preferences',
        [JSON.stringify(preferences), userId],
      )
      if (!result.rows[0]) {
        json(res, 404, { error: 'User not found' })
        return
      }
      json(res, 200, result.rows[0].preferences)
      return
    }

    methodNotAllowed(res, ['GET', 'PUT', 'OPTIONS'])
  } catch (error) {
    json(res, 400, { error: error instanceof Error ? error.message : 'Invalid preferences' })
  }
}