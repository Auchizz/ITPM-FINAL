import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children, redirectTo = '/login', fallbackTo = '/dashboard' }) {
  const { token, user, loading } = useAuth()
  if (loading) return <div className="p-6">Loading...</div>
  if (!token) return <Navigate to={redirectTo} replace />
  if (user?.role !== 'admin') return <Navigate to={fallbackTo} replace />
  return children
}
