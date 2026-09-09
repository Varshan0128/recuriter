import type { IncomingMessage, ServerResponse } from 'node:http'
import { json } from './_lib/http.js'

export default function handler(_req: IncomingMessage, res: ServerResponse) {
  json(res, 200, {
    ok: true,
    service: 'hiredai-portal-api',
  })
}
