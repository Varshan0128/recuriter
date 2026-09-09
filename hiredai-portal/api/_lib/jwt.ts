import { createHmac, timingSafeEqual } from 'node:crypto'

type JwtPayload = Record<string, unknown>

function encodeBase64Url(input: string | Buffer) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8')
  return buffer
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function decodeBase64Url(input: string) {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/')
  return Buffer.from(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='), 'base64')
}

function parseDuration(value: string) {
  const match = /^(\d+)([smhd])$/i.exec(value.trim())
  if (!match) {
    throw new Error(`Invalid JWT_EXPIRES_IN value: ${value}`)
  }

  const amount = Number(match[1])
  const unit = match[2].toLowerCase()
  const secondsByUnit = {
    s: amount,
    m: amount * 60,
    h: amount * 60 * 60,
    d: amount * 60 * 60 * 24,
  } as const

  const seconds = secondsByUnit[unit as keyof typeof secondsByUnit]
  if (typeof seconds !== 'number') {
    throw new Error(`Invalid JWT_EXPIRES_IN value: ${value}`)
  }

  return seconds
}

export function signJwt(payload: JwtPayload, secret: string, expiresIn = '8h', issuer = 'hiredai-portal') {
  const header = { alg: 'HS256', typ: 'JWT' }
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + parseDuration(expiresIn)
  const tokenPayload = { ...payload, iat: issuedAt, exp, iss: issuer }
  const encodedHeader = encodeBase64Url(JSON.stringify(header))
  const encodedPayload = encodeBase64Url(JSON.stringify(tokenPayload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = createHmac('sha256', secret).update(signingInput).digest()
  return `${signingInput}.${encodeBase64Url(signature)}`
}

export function verifyJwt<T extends JwtPayload>(token: string, secret: string) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = createHmac('sha256', secret).update(signingInput).digest()
  const actualSignature = decodeBase64Url(encodedSignature)

  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    throw new Error('Invalid JWT signature')
  }

  const payload = JSON.parse(decodeBase64Url(encodedPayload).toString('utf8')) as T & {
    exp?: number
    iat?: number
    iss?: string
  }

  if (typeof payload.exp === 'number' && Math.floor(Date.now() / 1000) >= payload.exp) {
    throw new Error('JWT expired')
  }

  return payload
}
