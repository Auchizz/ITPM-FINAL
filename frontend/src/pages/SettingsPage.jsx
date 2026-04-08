import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import authApi from '../api/authApi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordFeedback, setPasswordFeedback] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [notifications, setNotifications] = useState({
    email: false,
    inApp: true,
  })

  function validatePasswordForm() {
    const nextErrors = {}

    if (!passwordForm.currentPassword) nextErrors.currentPassword = 'Current password is required.'
    if (!passwordForm.newPassword) nextErrors.newPassword = 'New password is required.'
    else if (passwordForm.newPassword.length < 8) nextErrors.newPassword = 'New password must be at least 8 characters.'

    if (!passwordForm.confirmPassword) nextErrors.confirmPassword = 'Confirm your new password.'
    else if (passwordForm.newPassword !== passwordForm.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'

    setPasswordErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordFeedback('')
    setPasswordError('')

    if (!validatePasswordForm()) return

    try {
      setPasswordBusy(true)
      const response = await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordFeedback(response?.message || 'Password updated successfully.')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setPasswordErrors({})
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Unable to update password.')
    } finally {
      setPasswordBusy(false)
    }
  }

  function updatePasswordField(key, value) {
    setPasswordForm((current) => ({ ...current, [key]: value }))
    if (passwordErrors[key]) {
      setPasswordErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="space-y-6 p-6 md:p-8">
          <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <div className="card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Identity</div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Account preferences</h3>
                  </div>
                  <div className="badge">Primary controls</div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-5">
                    <div className="text-sm font-semibold text-primary">Profile visibility</div>
                    <div className="mt-2 text-sm leading-6 text-[#6f675d]">Manage profile details, faculty labels, and how your campus identity is presented.</div>
                    <Link to="/profile" className="mt-4 inline-flex rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-primary">
                      Edit profile
                    </Link>
                  </div>
                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-5">
                    <div className="text-sm font-semibold text-primary">Connected sign-in</div>
                    <div className="mt-2 text-sm leading-6 text-[#6f675d]">Keep access clean with external sign-in providers and campus login workflows.</div>
                    <button className="mt-4 btn-primary">Connect SSO</button>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="card" noValidate>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Security</div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Change password</h3>
                  </div>
                  <div className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Backend connected
                  </div>
                </div>

                {passwordFeedback ? (
                  <div className="mt-5 rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">
                    {passwordFeedback}
                  </div>
                ) : null}
                {passwordError ? (
                  <div className="mt-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">
                    {passwordError}
                  </div>
                ) : null}

                <div className="mt-6 grid gap-4">
                  <div>
                    <label className="text-sm font-semibold text-primary">Current password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                      className={`input mt-2 ${passwordErrors.currentPassword ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                      placeholder="Enter current password"
                    />
                    {passwordErrors.currentPassword ? <p className="mt-2 text-sm text-danger">{passwordErrors.currentPassword}</p> : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-primary">New password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                        className={`input mt-2 ${passwordErrors.newPassword ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                        placeholder="At least 8 characters"
                      />
                      {passwordErrors.newPassword ? <p className="mt-2 text-sm text-danger">{passwordErrors.newPassword}</p> : null}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-primary">Confirm new password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                        className={`input mt-2 ${passwordErrors.confirmPassword ? 'border-danger focus:border-danger focus:ring-[#f2d4ce]' : ''}`}
                        placeholder="Repeat new password"
                      />
                      {passwordErrors.confirmPassword ? <p className="mt-2 text-sm text-danger">{passwordErrors.confirmPassword}</p> : null}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 text-sm leading-6 text-[#6f675d]">
                    Passwords should be unique, at least 8 characters long, and different from your current password.
                  </div>

                  <div>
                    <button type="submit" className="btn-primary" disabled={passwordBusy}>
                      {passwordBusy ? 'Updating...' : 'Update password'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-[#fffaf2] via-[#f7efe3] to-[#efe5d6]">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Notifications</div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Attention controls</h3>
                <div className="mt-6 space-y-4">
                  <label className="flex items-center justify-between rounded-[24px] border border-[#eee3d3] bg-[#fffdf8] px-4 py-4">
                    <div>
                      <div className="font-semibold text-primary">Email notifications</div>
                      <div className="mt-1 text-sm text-[#6f675d]">Receive account and profile alerts in your inbox.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications((current) => ({ ...current, email: e.target.checked }))}
                      className="h-5 w-5 accent-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-[24px] border border-[#eee3d3] bg-[#fffdf8] px-4 py-4">
                    <div>
                      <div className="font-semibold text-primary">In-app notifications</div>
                      <div className="mt-1 text-sm text-[#6f675d]">Show live notices inside the dashboard.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.inApp}
                      onChange={(e) => setNotifications((current) => ({ ...current, inApp: e.target.checked }))}
                      className="h-5 w-5 accent-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="card">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Environment</div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Workspace notes</h3>
                <div className="mt-6 space-y-3">
                  <div className="rounded-[22px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                    <div className="text-sm font-semibold text-primary">Theme alignment</div>
                    <div className="mt-1 text-sm text-[#6f675d]">Controls and surfaces now match the same sport palette used across authentication and dashboards.</div>
                  </div>
                  <div className="rounded-[22px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                    <div className="text-sm font-semibold text-primary">Live password flow</div>
                    <div className="mt-1 text-sm text-[#6f675d]">The change password form now sends real requests to the backend instead of acting as a placeholder.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
