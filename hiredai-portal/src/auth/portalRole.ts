const PORTAL_ROLE_KEY = 'hiredai.portalRole'

export type PortalRole = 'recruiter' | 'candidate' | 'admin' | string

export function getPortalRole(): PortalRole {
  if (typeof window === 'undefined') {
    return 'recruiter'
  }

  return (window.localStorage.getItem(PORTAL_ROLE_KEY) as PortalRole) || 'recruiter'
}

export function setPortalRole(role: PortalRole) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(PORTAL_ROLE_KEY, role)
}

export function clearPortalRole() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(PORTAL_ROLE_KEY)
}
