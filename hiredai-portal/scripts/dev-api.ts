import 'dotenv/config'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import applicationsHandler from '../api/applications.js'
import candidatesHandler from '../api/candidates.js'
import companiesHandler from '../api/companies.js'
import dashboardHandler from '../api/dashboard.js'
import healthHandler from '../api/health.js'
import interviewsHandler from '../api/interviews.js'
import jobsHandler from '../api/jobs.js'
import notesHandler from '../api/notes.js'
import loginHandler from '../api/auth/login.js'
import meHandler from '../api/auth/me.js'
import registerHandler from '../api/auth/register.js'
import settingsHandler from '../api/settings.js'
import notificationsHandler from '../api/notifications.js'
import teamHandler from '../api/team.js'
import activityHandler from '../api/activity.js'
import analyticsHandler from '../api/analytics.js'
import scorecardsHandler from '../api/scorecards.js'
import evaluationsHandler from '../api/evaluations.js'

const port = Number(process.env.API_PORT) || 3001

type ApiHandler = (req: IncomingMessage, res: ServerResponse) => unknown

const routes: Record<string, ApiHandler> = {
  '/api/applications': applicationsHandler,
  '/api/auth/login': loginHandler,
  '/api/auth/me': meHandler,
  '/api/auth/register': registerHandler,
  '/api/candidates': candidatesHandler,
  '/api/companies': companiesHandler,
  '/api/dashboard': dashboardHandler,
  '/api/health': healthHandler,
  '/api/interviews': interviewsHandler,
  '/api/jobs': jobsHandler,
  '/api/notes': notesHandler,
  '/api/settings': settingsHandler,
  '/api/notifications': notificationsHandler,
  '/api/team': teamHandler,
  '/api/activity': activityHandler,
  '/api/analytics': analyticsHandler,
  '/api/scorecards': scorecardsHandler,
  '/api/evaluations': evaluationsHandler,
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`).pathname
  const handler = routes[path]

  if (!handler) {
    sendJson(res, 404, { error: 'Not found' })
    return
  }

  try {
    await handler(req, res)
  } catch (error) {
    if (!res.writableEnded) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : 'Internal server error',
      })
    }
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`API server listening at http://localhost:${port}`)
})
