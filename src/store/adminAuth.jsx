import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '')

const AdminAuthCtx = createContext(null)

export function useAdminAuth() {
  return useContext(AdminAuthCtx)
}

const SESSION_KEY = 'kisanraw_admin_token'
const ADMIN_KEY = 'kisanraw_admin_user'

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY) || null)
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(ADMIN_KEY) || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // On mount, validate the stored token with the backend
  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE}/api/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAdmin(data.admin)
          sessionStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin))
        } else {
          // Token invalid or expired — clear session
          sessionStorage.removeItem(SESSION_KEY)
          sessionStorage.removeItem(ADMIN_KEY)
          setToken(null)
          setAdmin(null)
        }
      })
      .catch(() => {
        // Network error — keep cached session for offline resilience
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || `http_${res.status}`)
      }
      sessionStorage.setItem(SESSION_KEY, data.token)
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin))
      setToken(data.token)
      setAdmin(data.admin)
      return { success: true, admin: data.admin }
    } catch (err) {
      const msg = err.message === 'invalid_credentials'
        ? 'Invalid email or password.'
        : err.message === 'Failed to fetch'
        ? 'Cannot reach the server. Check your connection.'
        : `Login failed: ${err.message}`
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(ADMIN_KEY)
    setToken(null)
    setAdmin(null)
  }, [])

  return (
    <AdminAuthCtx.Provider value={{ token, admin, loading, error, login, logout, apiBase: API_BASE }}>
      {children}
    </AdminAuthCtx.Provider>
  )
}

/**
 * Wraps a route element — redirects to / if no admin session exists.
 */
export function ProtectedRoute({ children }) {
  const { token } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [token, navigate])

  if (!token) return null
  return children
}

export { API_BASE }
