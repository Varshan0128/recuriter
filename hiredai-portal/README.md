# React + TypeScript + Vite

## Local Development

Run the frontend and backend in separate terminals:

**Terminal 1: frontend**

```bash
npm run dev
```

The Vite frontend runs at `http://localhost:5173` with HMR enabled. Requests to `/api/*` are proxied to the backend at `http://localhost:3001`.

**Terminal 2: backend**

```bash
npm run dev:api
```

The standalone API server runs at `http://localhost:3001` and uses the existing handlers under `api/`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Backend Foundation

This repo now includes a Vercel-friendly backend foundation using:

- Postgres on Neon or Supabase
- JWT-based auth scaffolding
- Serverless API routes under `api/`
- SQL migrations and a sample seed script under `db/` and `scripts/`

### Database Schema

The initial migration creates:

- `users`
- `companies`
- `jobs`
- `candidates`
- `applications`
- `interviews`
- `notes`

It also defines the required enums for jobs, applications, and interviews.

### Running Migrations

Set `DATABASE_URL` first, then run:

```bash
npm run db:migrate
```

### Seeding Sample Data

After migrations, load sample rows for local testing with:

```bash
npm run db:seed
```

The seed script inserts a couple of companies, users, jobs, candidates, applications, an interview, and a note.

### API Routes

The following backend routes are available:

- `GET /api/health`
- `GET|POST|PATCH|DELETE /api/companies`
- `GET|POST|PATCH|DELETE /api/jobs`
- `GET|POST|PATCH|DELETE /api/candidates`
- `GET|POST|PATCH|DELETE /api/applications`
- `GET|POST|PATCH|DELETE /api/interviews`
- `GET|POST|PATCH|DELETE /api/notes`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Each CRUD route accepts an `id` query parameter for single-record reads, updates, and deletes.

### Environment Variables

Add these to Vercel and your local environment:

- `DATABASE_URL`
- `PGSSL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
