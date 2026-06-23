import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

/* Client-side "account" session — design/prototype only, mirrors CartContext.
   No real authentication yet; a successful login/register just stores the
   user in localStorage so the account flow is navigable. Swap these three
   actions for real backend calls (Supabase/etc.) when auth is wired up. */
const AuthContext = createContext(null)
const STORAGE_KEY = 'gf_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null } catch { return null }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch { /* ignore */ }
  }, [user])

  const login = useCallback((email) => {
    const name = String(email).split('@')[0].replace(/[._-]+/g, ' ').trim() || 'Fighter'
    setUser({ name, email })
  }, [])

  const register = useCallback((name, email) => {
    setUser({ name: name || 'Fighter', email })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
