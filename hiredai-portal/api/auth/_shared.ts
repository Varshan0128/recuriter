import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from '../_lib/db.js'
import { badRequest, conflict, getBearerToken, json, serviceUnavailable, unauthorized } from '../_lib/http.js'
import { hashPassword, verifyPassword } from '../_lib/password.js'
import { signJwt, verifyJwt } from '../_lib/jwt.js'

type UserRow = {
  id: string
  name: string
  email: string
  password_hash: string
  role: string
  company_id: string | null
  created_at: string
}

export type PublicUser = Omit<UserRow, 'password_hash'>

export function toPublicUser(user: UserRow): PublicUser {
  const { password_hash: _passwordHash, ...rest } = user
  return rest
}

export async function registerUser(input: {
  name?: unknown
  email?: unknown
  password?: unknown
  role?: unknown
  company_id?: unknown
}) {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = typeof input.password === 'string' ? input.password : ''
  const role = typeof input.role === 'string' && input.role.trim() ? input.role.trim() : 'recruiter'
  const companyId = typeof input.company_id === 'string' && input.company_id.trim() ? input.company_id.trim() : null

  if (!name || !email || !password) {
    throw new Error('name, email, and password are required')
  }

  const existing = await query<UserRow>('select * from users where email = $1 limit 1', [email])
  if ((existing.rowCount ?? 0) > 0) {
    throw new Error('Email already exists')
  }

  const passwordHash = hashPassword(password)
  const result = await query<UserRow>(
    `insert into users (name, email, password_hash, role, company_id)
     values ($1, $2, $3, $4, $5)
     returning id, name, email, password_hash, role, company_id, created_at`,
    [name, email, passwordHash, role, companyId],
  )

  return result.rows[0]
}

export async function authenticateUser(input: { email?: unknown; password?: unknown }) {
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
  const password = typeof input.password === 'string' ? input.password : ''

  if (!email || !password) {
    throw new Error('email and password are required')
  }

  const result = await query<UserRow>('select * from users where email = $1 limit 1', [email])
  const user = result.rows[0]
  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new Error('Invalid email or password')
  }

  return user
}

export function issueSessionToken(user: PublicUser) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is required')
  }

  return signJwt(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
    },
    secret,
    process.env.JWT_EXPIRES_IN ?? '8h',
  )
}

export async function getSessionUser(token: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is required')
  }

  const payload = verifyJwt<{ sub?: string }>(token, secret)
  const userId = typeof payload.sub === 'string' ? payload.sub : null
  if (!userId) {
    throw new Error('Invalid session token')
  }

  const result = await query<UserRow>('select * from users where id = $1 limit 1', [userId])
  const user = result.rows[0]
  if (!user) {
    throw new Error('User not found')
  }

  return user
}

export function handleAuthError(res: ServerResponse, error: unknown) {
  const message = error instanceof Error ? error.message : 'Authentication failed'
  if (message === 'Invalid email or password') {
    unauthorized(res, message)
    return
  }

  if (message === 'Email already exists') {
    conflict(res, message)
    return
  }

  if (message === 'JWT_SECRET is required' || message === 'Invalid session token' || message === 'User not found') {
    unauthorized(res, message)
    return
  }

  if (error instanceof AggregateError || (error instanceof Error && 'code' in error)) {
    serviceUnavailable(res, 'Authentication service unavailable')
    return
  }

  badRequest(res, message)
}

export function getSessionTokenFromRequest(req: IncomingMessage) {
  return getBearerToken(req)
}

export { json }
