import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useAuth } from '../auth/AuthContext'

function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative hidden overflow-hidden bg-violet-700 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-lg">
                  <BrandLogo size={30} />
                </div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-white">
                    Hired<span className="text-cyan-200">AI</span>
                  </div>
                  <div className="text-xs font-medium text-violet-100">Recruiter Portal</div>
                </div>
              </div>
              <div className="mt-24 max-w-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">One clear hiring workspace</p>
                <h2 className="mt-5 text-4xl font-black leading-tight text-white">Move great people forward.</h2>
                <p className="mt-5 text-base leading-7 text-violet-100">Bring jobs, candidates, interviews, and decisions into one focused place.</p>
              </div>
            </div>
            <p className="relative text-xs text-violet-200">Secure access for your recruiting team.</p>
          </section>

          <section className="bg-white px-6 py-10 text-slate-900 sm:px-12 sm:py-14">
            <div className="mx-auto max-w-md">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50">
                  <BrandLogo size={28} />
                </div>
                <div>
                  <div className="text-lg font-extrabold tracking-tight text-slate-950">
                    Hired<span className="text-violet-600">AI</span>
                  </div>
                  <div className="text-xs font-medium text-slate-500">Recruiter Portal</div>
                </div>
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              <div className="mt-8">{children}</div>
              <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </label>
  )
}

function AuthError({ message }: { message: string }) {
  return <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>
}

export function LoginPage() {
  const { login, loading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-white">Checking your session...</div>
  }

  if (user) {
    return <Navigate to="/hr/dashboard" replace />
  }

  const state = location.state as { from?: { pathname?: string } } | null
  const destination = state?.from?.pathname || '/hr/dashboard'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to HiredAI"
      description="Access your recruiting workspace and keep every hiring decision moving."
      footer={
        <>
          New to HiredAI?{' '}
          <Link to="/signup" className="font-bold text-violet-600 hover:text-violet-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthError message={error} /> : null}
        <AuthInput label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@company.com" />
        <AuthInput label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" placeholder="Enter your password" />
        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}

export function SignupPage() {
  const { signup, loading, user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-white">Checking your session...</div>
  }

  if (user) {
    return <Navigate to="/hr/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signup(name, email, password)
      navigate('/hr/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create your account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Start hiring clearly"
      title="Create your account"
      description="Set up your recruiter workspace and bring your hiring workflow into focus."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthError message={error} /> : null}
        <AuthInput label="Full name" value={name} onChange={setName} autoComplete="name" placeholder="Your full name" />
        <AuthInput label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@company.com" />
        <AuthInput label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" placeholder="At least 8 characters" />
        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
