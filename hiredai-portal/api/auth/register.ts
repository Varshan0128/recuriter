import type { IncomingMessage, ServerResponse } from 'node:http'
import { json, methodNotAllowed, readJsonBody } from '../_lib/http.js'
import { handleAuthError, issueSessionToken, registerUser, toPublicUser } from './_shared.js'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST', 'OPTIONS'])
    return
  }

  try {
    const body = (await readJsonBody(req)) as Record<string, unknown>
    const user = await registerUser(body)
    const publicUser = toPublicUser(user)
    const token = issueSessionToken(publicUser)

    json(res, 201, {
      user: publicUser,
      token,
    })
  } catch (error) {
    handleAuthError(res, error)
  }
}
