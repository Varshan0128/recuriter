import {
  createContext,
  type ReactNode,
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
  company_id: string
  lastName?: string
  email: string
  fullName: string
}

type AuthContextValue = {
    user: AuthUser
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
  portalRole: string
  logout: () => void
  setPortalRole: (role: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

  const mockUser: AuthUser = {
    id: '9e1f078f-3464-453d-87e2-da9c68666c99',
    name: 'Varshan',
    firstName: 'Varshan',
    role: 'Recruiter',
    company_id: '3ad5d665-fb13-43a8-919c-9952a30a3ce4',
    email: 'varshan@example.com',
    fullName: 'Varshan',
  }

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user] = useState<AuthUser>(mockUser)
  const [portalRole, setPortalRoleState] = useState<string>(() => getPortalRole())

    const login = async (_email: string, _password: string) => {}

    const signup = async (_name: string, _email: string, _password: string) => {}

  const logout = () => {
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
      loading: false,
      login,
      signup,
      portalRole,
      logout,
      setPortalRole,
    }),
    [user, portalRole],
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
