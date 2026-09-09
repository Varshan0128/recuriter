import type { IncomingMessage, ServerResponse } from 'node:http'
import { json, methodNotAllowed, unauthorized } from '../_lib/http.js'
import { getSessionTokenFromRequest, getSessionUser, toPublicUser } from './_shared.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET', 'OPTIONS'])
    return
  }

  const token = getSessionTokenFromRequest(req)
  if (!token) {
    unauthorized(res)
    return
  }

  try {
    const user = await getSessionUser(token)
    json(res, 200, { user: toPublicUser(user) })
  } catch {
    unauthorized(res)
  }
}
