import type { IncomingMessage, ServerResponse } from 'node:http'
import { query } from './db.js'
import { badRequest, json, methodNotAllowed, readJsonBody } from './http.js'

type CrudConfig = {
  table: string
  orderBy?: string
  listFilterField?: string
  createFields: readonly string[]
  updateFields: readonly string[]
  requiredCreateFields: readonly string[]
  jsonFields?: readonly string[]
}

function isMissingValue(value: unknown) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
}

function pickFields(source: Record<string, unknown>, fields: readonly string[]) {
  const picked: Record<string, unknown> = {}
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(source, field) && source[field] !== undefined) {
      picked[field] = source[field]
    }
  }
  return picked
}

function serializeJsonFields(data: Record<string, unknown>, fields: readonly string[] = []) {
  for (const field of fields) {
    const value = data[field]
    if (value !== undefined && value !== null && typeof value !== 'string') {
      data[field] = JSON.stringify(value)
    }
  }
  return data
}

function getId(req: IncomingMessage, body: Record<string, unknown>) {
  const url = new URL(req.url ?? '', 'http://localhost')
  return (url.searchParams.get('id') ?? (typeof body.id === 'string' ? body.id : null))?.trim() || null
}

export function createCrudHandler(config: CrudConfig) {
  const orderBy = config.orderBy ?? 'created_at'

  return async function crudHandler(req: IncomingMessage, res: ServerResponse) {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (!req.method) {
      methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'])
      return
    }

    try {
      if (req.method === 'GET') {
        const url = new URL(req.url ?? '', 'http://localhost')
        const id = url.searchParams.get('id')
        if (id) {
          const result = await query(`select * from ${config.table} where id = $1 limit 1`, [id])
          if (result.rowCount === 0) {
            json(res, 404, { error: 'Not found' })
            return
          }
          json(res, 200, result.rows[0])
          return
        }

        const filterValue = config.listFilterField ? url.searchParams.get(config.listFilterField) : null
        const whereClause = config.listFilterField && filterValue ? ` where ${config.listFilterField} = $1` : ''
        const result = await query(
          `select * from ${config.table}${whereClause} order by ${orderBy} desc`,
          filterValue ? [filterValue] : [],
        )
        json(res, 200, result.rows)
        return
      }

      if (req.method === 'POST') {
        const body = (await readJsonBody(req)) as Record<string, unknown>
        const data = serializeJsonFields(pickFields(body, config.createFields), config.jsonFields)
        const missingFields = config.requiredCreateFields.filter((field) => isMissingValue(data[field]))
        if (missingFields.length > 0) {
          badRequest(res, `Missing required fields: ${missingFields.join(', ')}`)
          return
        }

        const columns = Object.keys(data)
        if (columns.length === 0) {
          badRequest(res, 'No writable fields provided')
          return
        }

        const values = columns.map((column) => data[column])
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ')
        const result = await query(
          `insert into ${config.table} (${columns.join(', ')}) values (${placeholders}) returning *`,
          values,
        )
        json(res, 201, result.rows[0])
        return
      }

      if (req.method === 'PATCH') {
        const body = (await readJsonBody(req)) as Record<string, unknown>
        const id = getId(req, body)
        if (!id) {
          badRequest(res, 'Missing id')
          return
        }

        const data = serializeJsonFields(pickFields(body, config.updateFields), config.jsonFields)
        const columns = Object.keys(data)
        if (columns.length === 0) {
          badRequest(res, 'No writable fields provided')
          return
        }

        const assignments = columns.map((column, index) => `${column} = $${index + 1}`).join(', ')
        const values = columns.map((column) => data[column])
        values.push(id)
        const result = await query(
          `update ${config.table} set ${assignments} where id = $${values.length} returning *`,
          values,
        )
        if (result.rowCount === 0) {
          json(res, 404, { error: 'Not found' })
          return
        }
        json(res, 200, result.rows[0])
        return
      }

      if (req.method === 'DELETE') {
        const body = (await readJsonBody(req)) as Record<string, unknown>
        const id = getId(req, body)
        if (!id) {
          badRequest(res, 'Missing id')
          return
        }

        const result = await query(`delete from ${config.table} where id = $1 returning *`, [id])
        if (result.rowCount === 0) {
          json(res, 404, { error: 'Not found' })
          return
        }
        json(res, 200, result.rows[0])
        return
      }

      methodNotAllowed(res, ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'])
    } catch (error) {
      json(res, 500, {
        error: error instanceof Error ? error.message : 'Internal server error',
      })
    }
  }
}
