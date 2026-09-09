import 'dotenv/config'
import { Client } from 'pg'
import { hashPassword } from '../api/_lib/password.js'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  const client = new Client({
    connectionString,
    ssl: process.env.PGSSL !== 'false' ? { rejectUnauthorized: false } : undefined,
  })

  await client.connect()

  const recruiterPassword = hashPassword('Welcome123!')
  const interviewerPassword = hashPassword('Welcome123!')

  try {
    await client.query('begin')
    await client.query(`
      truncate table
        notes,
        interviews,
        applications,
        jobs,
        candidates,
        users,
        companies
      restart identity cascade
    `)

    const companyResult = await client.query<{ id: string; name: string }>(
      `insert into companies (name, logo_url, description, verified)
       values
         ('Nova Retail', 'https://example.com/logos/nova-retail.png', 'Scaling consumer operations and fulfillment.', true),
         ('Vertex Health', 'https://example.com/logos/vertex-health.png', 'Healthcare platform hiring across product and data.', false)
       returning id, name`,
    )

    const companyByName = new Map(companyResult.rows.map((row) => [row.name as string, row.id as string]))

    const userResult = await client.query<{ id: string; email: string }>(
      `insert into users (name, email, password_hash, role, company_id)
       values
         ('Aarav Mehta', 'aarav@example.com', $1, 'recruiter', $2),
         ('Sara Iyer', 'sara@example.com', $3, 'interviewer', $4)
       returning id, email`,
      [recruiterPassword, companyByName.get('Nova Retail'), interviewerPassword, companyByName.get('Vertex Health')],
    )

    const userByEmail = new Map(userResult.rows.map((row) => [row.email as string, row.id as string]))

    const jobResult = await client.query<{ id: string; title: string }>(
      `insert into jobs (
         company_id,
         title,
         description,
         employment_type,
         work_mode,
         experience_min,
         experience_max,
         salary_min,
         salary_max,
         salary_currency,
         status,
         created_by
       )
       values
         ($1, 'Senior Product Designer', 'Own end-to-end product design for high-volume hiring workflows.', 'full-time', 'hybrid', 4, 8, 22000, 32000, 'USD', 'published', $3),
         ($2, 'Data Analyst Intern', 'Support funnel reporting, dashboards, and candidate insights.', 'internship', 'remote', 0, 1, 1200, 1800, 'USD', 'draft', $3)
       returning id, title`,
      [companyByName.get('Nova Retail'), companyByName.get('Vertex Health'), userByEmail.get('aarav@example.com')],
    )

    const jobByTitle = new Map(jobResult.rows.map((row) => [row.title as string, row.id as string]))

    const candidateResult = await client.query<{ id: string; email: string }>(
      `insert into candidates (name, email, phone, resume_url)
       values
         ('Priya Nair', 'priya@example.com', '+91-98765-43210', 'https://example.com/resumes/priya.pdf'),
         ('Kabir Singh', 'kabir@example.com', '+91-91234-56789', 'https://example.com/resumes/kabir.pdf')
       returning id, email`,
    )

    const candidateByEmail = new Map(candidateResult.rows.map((row) => [row.email as string, row.id as string]))

    const applicationResult = await client.query<{ id: string; candidate_id: string }>(
      `insert into applications (job_id, candidate_id, status)
       values
         ($1, $2, 'reviewed'),
         ($3, $4, 'interview')
       returning id, candidate_id`,
      [
        jobByTitle.get('Senior Product Designer'),
        candidateByEmail.get('priya@example.com'),
        jobByTitle.get('Data Analyst Intern'),
        candidateByEmail.get('kabir@example.com'),
      ],
    )

    const applicationByCandidate = new Map(applicationResult.rows.map((row) => [row.candidate_id as string, row.id as string]))

    await client.query(
      `insert into interviews (application_id, scheduled_at, interviewer_id, meeting_url, status)
       values
         ($1, now() + interval '2 days', $2, 'https://meet.example.com/interview/priya', 'scheduled')`,
      [applicationByCandidate.get(candidateByEmail.get('priya@example.com') ?? ''), userByEmail.get('sara@example.com')],
    )

    await client.query(
      `insert into notes (application_id, author_id, content)
       values
         ($1, $2, 'Strong visual thinking and a clean case-study presentation.')`,
      [applicationByCandidate.get(candidateByEmail.get('kabir@example.com') ?? ''), userByEmail.get('aarav@example.com')],
    )

    await client.query('commit')
    console.log('Seed completed with sample users, companies, jobs, candidates, applications, interviews, and notes.')
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
