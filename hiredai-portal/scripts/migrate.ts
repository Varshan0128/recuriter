import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { Client } from 'pg'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  const client = new Client({
    connectionString,
    ssl: process.env.PGSSL !== 'false' ? { rejectUnauthorized: false } : undefined,
  })

  const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations')
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right))

  await client.connect()

  try {
    await client.query('begin')
    for (const fileName of files) {
      const filePath = path.join(migrationsDir, fileName)
      const sql = readFileSync(filePath, 'utf8')
      console.log(`Applying ${fileName}`)
      await client.query(sql)
    }
    await client.query('commit')
    console.log(`Applied ${files.length} migration(s).`)
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

