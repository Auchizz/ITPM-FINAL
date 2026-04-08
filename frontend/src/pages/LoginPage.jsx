import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(email)) nextErrors.email = 'Enter a valid email address.'

    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!validate()) return

    try {
      setSubmitting(true)
      const ok = await login({ email: email.trim(), password })
      if (ok) navigate('/dashboard')
      else setError('Invalid credentials.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-pagebg px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-[#d8c6ab] bg-[#fffaf2] shadow-[0_32px_90px_-36px_rgba(23,50,77,0.35)] lg:grid-cols-[1.1fr,0.9fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[#224764] to-sportgreen p-10 text-[#fff8ef] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,248,239,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(216,140,79,0.2),transparent_28%)]" />
          <div className="relative">
            <div className="inline-flex rounded-full border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#fff8ef]/75">
              Match Day Access
            </div>
            <h1 className="mt-6 max-w-md text-5xl font-black tracking-tight">Sign in and step back into the system.</h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#fff8ef]/78">
              SportSphere keeps identity, roles, and campus sport operations connected in one secure workspace.
            </p>
          </div>

          <div className="relative mt-10">
            <img src="/login-sport.svg" alt="SportSphere login illustration" className="w-full max-w-lg" />
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8c7d69]">Login</div>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-primary">Welcome back</h2>
              <p className="mt-3 text-sm leading-7 text-[#6f675d]">
                Use your campus account to continue managing profiles and access.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="text-sm font-semibold text-primary">Email</label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: '' }))
                  }}
                  className={`input mt-2 ${fieldErrors.email ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  placeholder="student@sport.edu"
                />
                {fieldErrors.email ? <p className="mt-2 text-sm text-danger">{fieldErrors.email}</p> : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-primary">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((current) => ({ ...current, password: '' }))
                  }}
                  className={`input mt-2 ${fieldErrors.password ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  placeholder="Enter your password"
                />
                {fieldErrors.password ? <p className="mt-2 text-sm text-danger">{fieldErrors.password}</p> : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Signing In...' : 'Login'}
                </button>
                <Link to="/register" className="text-sm font-semibold text-primary">Create account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
