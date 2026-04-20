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
      return true
    }
    return false
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axiosInstance.defaults.headers.common['Authorization']
    navigate('/login')
  }

  async function fetchProfile() {
    try {
      const profile = await authApi.profile()
      // profile is { success, message, data: user }
      setUser(profile?.data)
    } catch (err) {
      console.error('fetchProfile', err)
      // Only force logout on explicit 401 (invalid/expired token), not network errors
      if (err?.response?.status === 401) {
        logout()
      } else {
        setLoading(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
