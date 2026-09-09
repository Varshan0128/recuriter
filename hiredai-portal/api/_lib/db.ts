import { Pool, type QueryResultRow } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __hiredaiPool: Pool | undefined
}

function getPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  if (!globalThis.__hiredaiPool) {
    const useSsl = process.env.PGSSL !== 'false'
    globalThis.__hiredaiPool = new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    })
  }

  return globalThis.__hiredaiPool
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values)
}
