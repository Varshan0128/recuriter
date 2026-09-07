import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import { clearPortalRole, getPortalRole, setPortalRole as persistPortalRole } from './portalRole'

export type AuthUser = {
  firstName: string
  role: string
  lastName?: string
  email?: string
  fullName?: string
}

type AuthContextValue = {
  user: AuthUser
  portalRole: string
  logout: () => void
  setPortalRole: (role: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const mockUser: AuthUser = {
  firstName: 'Varshan',
  role: 'Recruiter',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser>(mockUser)
  const [portalRole, setPortalRoleState] = useState<string>(() => getPortalRole())

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
