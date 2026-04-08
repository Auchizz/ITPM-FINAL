import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }) {
  const { token, user, loading } = useAuth()
  if (loading)              return <div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>
  if (!token)               return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
