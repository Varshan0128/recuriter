import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { applicationFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'applications',
  orderBy: 'applied_at',
  createFields: applicationFields,
  updateFields: applicationFields,
  requiredCreateFields: ['job_id', 'candidate_id'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
