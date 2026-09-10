export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })
  const body = (await response.json().catch(() => null)) as T & { error?: string }
  if (!response.ok) {
    throw new Error(body?.error || `Request failed with status ${response.status}`)
  }
  return body
}

export function queryString(params: Record<string, string | null | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  const result = search.toString()
  return result ? `?${result}` : ''
}