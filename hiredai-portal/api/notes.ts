import type { IncomingMessage, ServerResponse } from 'node:http'
import { createCrudHandler } from './_lib/crud.js'
import { noteFields } from './_lib/resources.js'

export default createCrudHandler({
  table: 'notes',
  orderBy: 'created_at',
  createFields: noteFields,
  updateFields: noteFields,
  requiredCreateFields: ['application_id', 'content'] as const,
}) as unknown as (req: IncomingMessage, res: ServerResponse) => void
