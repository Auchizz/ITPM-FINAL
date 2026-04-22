import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ModuleAdminLoginPage() {
  const navigate = useNavigate()
  const { login, logout, token, user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) return
    if (user?.role === 'admin') navigate('/dashboard/module/admin', { replace: true })
  }, [navigate, token, user])

  if (!loading && token && user?.role === 'admin') {
    return <Navigate to="/dashboard/module/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const loggedInUser = await login({ email, password })

      if (!loggedInUser) {
        setError('Unable to sign in with those credentials.')
        setSubmitting(false)
        return
      }

      if (loggedInUser.role !== 'admin') {
        logout('/module-admin/login')
        setError('This portal is restricted to module administrators.')
        setSubmitting(false)
        return
      }

      navigate('/dashboard/module/admin', { replace: true })
    } catch (submitError) {
      console.error('moduleAdminLogin', submitError)
      setError('Admin login failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className="sliit-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="sliit-card p-8 sm:p-10">
          <p className="sliit-pill">Admin Access</p>
          <h1 className="sliit-heading mt-6 text-5xl text-white sm:text-6xl">
            Sports Module admin portal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-sliit-muted">
            Sign in with an administrator account to manage sports, clubs, matches, players, facilities, and inquiries through the same connected backend.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="text-sm uppercase tracking-[0.28em] text-sliit-gold">Uses Existing Auth</div>
              <div className="mt-3 text-xl font-semibold text-white">Same SportSphere credentials</div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="text-sm uppercase tracking-[0.28em] text-sliit-blue">Role Protected</div>
              <div className="mt-3 text-xl font-semibold text-white">Admins only beyond this point</div>
            </div>
          </div>
        </section>

        <section className="sliit-card p-8 sm:p-10">
          <h2 className="sliit-heading text-4xl text-white">Admin Sign In</h2>
          <p className="mt-3 text-sm leading-7 text-sliit-muted">
            This login screen is dedicated to the sports module admin portal, but it still authenticates against the existing SportSphere backend.
          </p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-sliit-muted">
              Admin email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="sliit-input"
                placeholder="admin@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm text-sliit-muted">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="sliit-input"
                placeholder="Password"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-800/60 bg-rose-200 px-4 py-3 text-sm text-rose-950">
                {error}
              </div>
            ) : null}

            <button type="submit" className="sliit-button-primary mt-2" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Open Admin Portal'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-sliit-muted">
            <Link to="/login" className="sliit-button-secondary">Standard Login</Link>
            <Link to="/dashboard" className="sliit-button-secondary">Back to Dashboard</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
