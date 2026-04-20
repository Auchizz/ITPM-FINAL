import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const ok = await login({ email, password })
      if (ok) navigate('/events')
      else setError('Invalid credentials')
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pagebg">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hidden md:flex flex-col justify-center p-8 rounded-xl bg-gradient-to-br from-primary to-sportgreen text-white">
          <h3 className="text-3xl font-bold">Welcome back</h3>
          <p className="mt-3 opacity-90">Sign in to access SportSphere — your campus user management platform.</p>
          <div className="mt-6">
            <div className="text-sm">Need help?</div>
            <div className="text-xs opacity-80">Contact your system administrator for access.</div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          {error && <div className="text-danger mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                placeholder="admin@sportsphere.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="btn-primary" type="submit">Login</button>
              <Link to="/register" className="text-sm">Create account</Link>
            </div>
            <div className="text-sm text-slate-500 text-center">or continue with</div>
            <div className="flex gap-3 justify-center">
              <button type="button" className="px-4 py-2 rounded-lg border">Google</button>
              <button type="button" className="px-4 py-2 rounded-lg border">SSO</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
