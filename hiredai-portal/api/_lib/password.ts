import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

function encodeBase64Url(value: Buffer) {
  return value
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function decodeBase64Url(value: string) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/')
  const normalized = padded.padEnd(Math.ceil(padded.length / 4) * 4, '=')
  return Buffer.from(normalized, 'base64')
}

export function hashPassword(password: string) {
  const salt = encodeBase64Url(randomBytes(16))
  const derivedKey = scryptSync(password, salt, 64)
  return `scrypt$${salt}$${encodeBase64Url(derivedKey)}`
}

export function verifyPassword(password: string, passwordHash: string) {
  const [scheme, salt, encodedKey] = passwordHash.split('$')
  if (scheme !== 'scrypt' || !salt || !encodedKey) {
    return false
  }

  const derivedKey = scryptSync(password, salt, 64)
  const expectedKey = decodeBase64Url(encodedKey)
  if (derivedKey.length !== expectedKey.length) {
    return false
  }

  return timingSafeEqual(derivedKey, expectedKey)
}

