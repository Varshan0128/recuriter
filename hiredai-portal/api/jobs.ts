import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { jobCreateFields, jobUpdateFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'jobs',
  orderBy: 'created_at',
  listFilterField: 'company_id',
  createFields: jobCreateFields,
  updateFields: jobUpdateFields,
  jsonFields: ['screening_questions'],
  requiredCreateFields: ['company_id', 'title', 'description', 'employment_type', 'work_mode'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
