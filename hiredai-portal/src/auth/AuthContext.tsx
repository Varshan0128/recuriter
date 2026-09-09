import {
  createContext,
  type ReactNode,
  useEffect,
  useContext,
  useMemo,
  useState,
} from 'react'
import { clearPortalRole, getPortalRole, setPortalRole as persistPortalRole } from './portalRole'

export type AuthUser = {
  id: string
  name: string
  firstName: string
  role: string
  company_id: string | null
  lastName?: string
  email: string
  fullName: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  portalRole: string
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setPortalRole: (role: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_TOKEN_KEY = 'hiredai.authToken'

type AuthResponse = {
  user: {
    id: string
    name: string
    email: string
    role: string
    company_id: string | null
  }
  token: string
}

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

function normalizeUser(user: AuthResponse['user']): AuthUser {
  const nameParts = user.name.trim().split(/\s+/)

  return {
    ...user,
    firstName: nameParts[0] || user.email,
    lastName: nameParts.slice(1).join(' ') || undefined,
    fullName: user.name,
  }
}

async function parseAuthResponse(response: Response) {
  const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null
  if (!response.ok) {
    throw new Error(body?.error || body?.message || 'Authentication failed')
  }

  return body as AuthResponse
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalRole, setPortalRoleState] = useState<string>(() => getPortalRole())

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(parseAuthResponse)
      .then((response) => {
        const nextUser = normalizeUser(response.user)
        setUser(nextUser)
        persistPortalRole(nextUser.role)
        setPortalRoleState(nextUser.role)
      })
      .catch(() => {
        window.localStorage.removeItem(AUTH_TOKEN_KEY)
        clearPortalRole()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const establishSession = async (path: string, body: Record<string, string>) => {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await parseAuthResponse(response)
    const nextUser = normalizeUser(result.user)

    window.localStorage.setItem(AUTH_TOKEN_KEY, result.token)
    setUser(nextUser)
    persistPortalRole(nextUser.role)
    setPortalRoleState(nextUser.role)
  }

  const login = (email: string, password: string) => establishSession('/api/auth/login', { email, password })

  const signup = (name: string, email: string, password: string) =>
    establishSession('/api/auth/register', { name, email, password, role: 'recruiter' })

  const logout = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
    clearPortalRole()
    setPortalRoleState('recruiter')
  }

  const setPortalRole = (role: string) => {
    persistPortalRole(role)
    setPortalRoleState(role)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      portalRole,
      login,
      signup,
      logout,
      setPortalRole,
    }),
    [user, loading, portalRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
