import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { candidateFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'candidates',
  orderBy: 'created_at',
  createFields: candidateFields,
  updateFields: candidateFields,
  requiredCreateFields: ['name', 'email'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
