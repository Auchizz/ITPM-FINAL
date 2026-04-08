<<<<<<< HEAD
=======
import React from 'react'
>>>>>>> origin/main
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
<<<<<<< HEAD
  if (loading) return <div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>
  if (!token)  return <Navigate to="/login" replace />
=======
  if (loading) return <div className="p-6">Loading...</div>
  if (!token) return <Navigate to="/login" replace />
>>>>>>> origin/main
  return children
}
