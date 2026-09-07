type UserAvatarProps = {
  firstName?: string
  lastName?: string
  name?: string
  src?: string
  className?: string
  size?: number
}

function getInitials(firstName?: string, lastName?: string, name?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/)
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
  }

  const first = firstName?.[0]?.toUpperCase() ?? ''
  const last = lastName?.[0]?.toUpperCase() ?? ''
  return `${first}${last}` || 'U'
}

export default function UserAvatar({
  firstName,
  lastName,
  name,
  src,
  className = '',
  size = 40,
}: UserAvatarProps) {
  const initials = getInitials(firstName, lastName, name)
  const dimension = `${size}px`

  if (src) {
    return (
      <img
        src={src}
        alt={name || [firstName, lastName].filter(Boolean).join(' ') || 'User avatar'}
        className={`rounded-full object-cover ${className}`}
        style={{ width: dimension, height: dimension }}
      />
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white ring-1 ring-white/10 ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label={name || [firstName, lastName].filter(Boolean).join(' ') || 'User avatar'}
    >
      {initials}
    </div>
  )
}

export { UserAvatar }
