import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { companyFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'companies',
  orderBy: 'created_at',
  createFields: companyFields,
  updateFields: companyFields,
  requiredCreateFields: ['name'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
