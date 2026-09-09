import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { interviewFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'interviews',
  orderBy: 'scheduled_at',
  createFields: interviewFields,
  updateFields: interviewFields,
  requiredCreateFields: ['application_id', 'scheduled_at'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
