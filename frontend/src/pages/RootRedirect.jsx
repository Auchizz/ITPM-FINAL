import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RootRedirect() {
  const { token, loading } = useAuth()

  if (loading) return <div className="p-6">Loading...</div>

  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}
