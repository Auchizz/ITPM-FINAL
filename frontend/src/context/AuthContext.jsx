<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import axiosInstance from '../api/axios'

const AuthContext = createContext()

// ── Demo users (used when backend is offline) ──────────────
const DEMO_USERS = {
  admin: {
    firstName: 'Admin', lastName: 'User', role: 'admin',
    email: 'admin@university.edu', studentId: 'ADMIN001',
    faculty: 'IT Department', createdAt: new Date().toISOString()
  },
  student: {
    firstName: 'Amal', lastName: 'Perera', role: 'student',
    email: 'amal@university.edu', studentId: '2022CS0112',
    faculty: 'Faculty of Engineering', createdAt: new Date().toISOString()
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token,   setToken]   = useState(() => localStorage.getItem('uni_token'))
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('uni_user')) } catch { return null } })
  const [loading, setLoading] = useState(true)

// AFTER — always sets loading false, even on error
useEffect(() => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (!user) {
      fetchProfile()  // fetchProfile already calls setLoading(false) in its finally block ✓
    } else {
      setLoading(false)
    }
  } else {
    setLoading(false)
  }
}, []) // ← run only on mount, not on every token change

  async function login({ studentId, password }) {
    try {
      const res = await authApi.login({ studentId, password })
      const t = res?.data?.token || res?.token
      const u = res?.data?.user  || res?.user
      if (t) {
        _setSession(t, u)
        return { ok: true, user: u }
      }
      return { ok: false, message: 'Invalid response from server' }
    } catch (err) {
      // ── Demo fallback ──
      if (studentId === 'admin'   && password === 'admin123')   return _demoLogin('admin')
      if (studentId === 'student' && password === 'student123') return _demoLogin('student')
      return { ok: false, message: err?.response?.data?.message || 'Invalid credentials' }
    }
  }

  function _demoLogin(role) {
    const u = DEMO_USERS[role]
    _setSession('demo-token', u)
    return { ok: true, user: u }
  }

  function _setSession(t, u) {
    localStorage.setItem('uni_token', t)
    localStorage.setItem('uni_user',  JSON.stringify(u))
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${t}`
    setToken(t)
    setUser(u)
  }

  function logout() {
    localStorage.removeItem('uni_token')
    localStorage.removeItem('uni_user')
    delete axiosInstance.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    navigate('/login')
=======
import React, { createContext, useContext, useEffect, useState } from 'react'
import authApi from '../api/authApi'
import axiosInstance from '../api/axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  async function login(credentials) {
    const res = await authApi.login(credentials)
    // backend responds with { success, message, data: { user, token } }
    const token = res?.data?.token
    const user = res?.data?.user
    if (token) {
      localStorage.setItem('token', token)
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setToken(token)
      setUser(user)
      return user
    }
    return null
  }

  function logout(redirectTo = '/login') {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axiosInstance.defaults.headers.common['Authorization']
    navigate(redirectTo)
>>>>>>> origin/main
  }

  async function fetchProfile() {
    try {
<<<<<<< HEAD
      const res = await authApi.profile()
      const u = res?.data || res
      setUser(u)
      localStorage.setItem('uni_user', JSON.stringify(u))
    } catch {
      // keep existing user from localStorage
=======
      const profile = await authApi.profile()
      // profile is { success, message, data: user }
      setUser(profile?.data)
      return profile?.data
    } catch (err) {
      console.error('fetchProfile', err)
      logout()
>>>>>>> origin/main
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  function updateUser(updates) {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('uni_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
=======
  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchProfile, setUser, loading }}>
>>>>>>> origin/main
      {children}
    </AuthContext.Provider>
  )
}

<<<<<<< HEAD
export function useAuth() { return useContext(AuthContext) }
=======
export function useAuth() {
  return useContext(AuthContext)
}
>>>>>>> origin/main
