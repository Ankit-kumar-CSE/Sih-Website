import { useState, useCallback } from 'react'
import { useAdminAuth } from '../store/adminAuth'

/**
 * Thin fetch wrapper for admin API calls.
 * Automatically attaches the admin JWT from context.
 * Returns { data, loading, error, refetch }.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi('/api/admin/dashboard')
 */
export function useApi(path, options = {}) {
  const { token, apiBase } = useAdminAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch_ = useCallback(async (overridePath, overrideOptions) => {
    const url = `${apiBase}${overridePath || path}`
    const opts = { ...options, ...overrideOptions }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url, {
        ...opts,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(opts.headers || {}),
        },
        body: opts.body != null ? JSON.stringify(opts.body) : undefined,
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error || `http_${res.status}`)
      }
      setData(json)
      return json
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [apiBase, path, token]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: fetch_, fetch: fetch_ }
}

/**
 * One-shot fetch — not stateful, just returns the JSON or throws.
 * Useful for POST/PATCH actions in event handlers.
 */
export async function adminFetch(apiBase, token, path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error || `http_${res.status}`)
  return json
}
