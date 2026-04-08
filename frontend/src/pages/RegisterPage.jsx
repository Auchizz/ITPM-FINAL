import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', studentId: '', faculty: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const nextErrors = {}

    if (!form.name.trim()) nextErrors.name = 'Full name is required.'
    else if (form.name.trim().length < 3) nextErrors.name = 'Full name must be at least 3 characters.'

    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'

    if (!form.studentId.trim()) nextErrors.studentId = 'Student ID is required.'
    if (!form.faculty.trim()) nextErrors.faculty = 'Faculty is required.'

    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    if (!form.confirm) nextErrors.confirm = 'Confirm your password.'
    else if (form.password !== form.confirm) nextErrors.confirm = 'Passwords do not match.'

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!validate()) return

    try {
      setSubmitting(true)
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        studentId: form.studentId.trim(),
        faculty: form.faculty.trim(),
      })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-pagebg px-6 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-[#d8c6ab] bg-[#fffaf2] shadow-[0_32px_90px_-36px_rgba(23,50,77,0.35)] lg:grid-cols-[1.04fr,0.96fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[#224764] to-accent p-10 text-[#fff8ef] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,248,239,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(47,122,107,0.18),transparent_28%)]" />
          <div className="relative">
            <div className="inline-flex rounded-full border border-[#fff8ef]/15 bg-[#fff8ef]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#fff8ef]/75">
              Team Entry
            </div>
            <h1 className="mt-6 max-w-md text-5xl font-black tracking-tight">Create your sport identity.</h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#fff8ef]/78">
              Register once, then manage student details, roles, and profile controls from one unified dashboard.
            </p>
          </div>

          <div className="relative mt-10">
            <img src="/register-sport.svg" alt="SportSphere registration illustration" className="w-full max-w-lg" />
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8c7d69]">Register</div>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-primary">Create account</h2>
              <p className="mt-3 text-sm leading-7 text-[#6f675d]">
                Start with the details your campus sport system needs from the beginning.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-primary">Full name</label>
                  <input
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`input mt-2 ${fieldErrors.name ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.name ? <p className="mt-2 text-sm text-danger">{fieldErrors.name}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-primary">Email</label>
                  <input
                    placeholder="student@sport.edu"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`input mt-2 ${fieldErrors.email ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.email ? <p className="mt-2 text-sm text-danger">{fieldErrors.email}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Student ID</label>
                  <input
                    placeholder="ST-2026-001"
                    value={form.studentId}
                    onChange={(e) => updateField('studentId', e.target.value)}
                    className={`input mt-2 ${fieldErrors.studentId ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.studentId ? <p className="mt-2 text-sm text-danger">{fieldErrors.studentId}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Faculty</label>
                  <input
                    placeholder="Faculty"
                    value={form.faculty}
                    onChange={(e) => updateField('faculty', e.target.value)}
                    className={`input mt-2 ${fieldErrors.faculty ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.faculty ? <p className="mt-2 text-sm text-danger">{fieldErrors.faculty}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Password</label>
                  <input
                    placeholder="Create password"
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className={`input mt-2 ${fieldErrors.password ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.password ? <p className="mt-2 text-sm text-danger">{fieldErrors.password}</p> : null}
                </div>

                <div>
                  <label className="text-sm font-semibold text-primary">Confirm password</label>
                  <input
                    placeholder="Repeat password"
                    type="password"
                    value={form.confirm}
                    onChange={(e) => updateField('confirm', e.target.value)}
                    className={`input mt-2 ${fieldErrors.confirm ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                  />
                  {fieldErrors.confirm ? <p className="mt-2 text-sm text-danger">{fieldErrors.confirm}</p> : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create account'}
                </button>
                <Link to="/login" className="text-sm font-semibold text-primary">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
