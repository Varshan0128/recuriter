import type { IncomingMessage, ServerResponse } from 'node:http'

const corsHeaders = {
  'access-control-allow-origin': process.env.CORS_ORIGIN ?? '*',
  'access-control-allow-headers': 'Content-Type, Authorization',
  'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
}

export function setCorsHeaders(res: ServerResponse) {
  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value)
  }
}

export function json(res: ServerResponse, statusCode: number, body: unknown) {
  setCorsHeaders(res)
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

export function methodNotAllowed(res: ServerResponse, allowed: string[]) {
  setCorsHeaders(res)
  res.setHeader('allow', allowed.join(', '))
  res.statusCode = 405
  res.end(JSON.stringify({ error: 'Method not allowed' }))
}

export function badRequest(res: ServerResponse, message: string) {
  json(res, 400, { error: message })
}

export function unauthorized(res: ServerResponse, message = 'Unauthorized') {
  json(res, 401, { error: message })
}

export function conflict(res: ServerResponse, message: string) {
  json(res, 409, { error: message })
}

export function serviceUnavailable(res: ServerResponse, message = 'Service temporarily unavailable') {
  json(res, 503, { error: message })
}

export async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim()
  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    throw new Error('Invalid JSON body')
  }
}

export function getBearerToken(req: IncomingMessage) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return null
  }

  return header.slice('Bearer '.length).trim() || null
}

