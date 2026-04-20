import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'

export default function SettingsPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState(null)
  const [pwSuccess, setPwSuccess] = useState(null)
  const [emailNotif, setEmailNotif] = useState(false)
  const [inAppNotif, setInAppNotif] = useState(false)

  async function handlePasswordUpdate(e) {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(null)
    if (!password) return setPwError('Please enter a new password.')
    if (password !== confirmPassword) return setPwError('Passwords do not match.')
    if (password.length < 6) return setPwError('Password must be at least 6 characters.')
    setPwSaving(true)
    try {
      await axiosInstance.put('/users/profile/me', { password })
      setPwSuccess('Password updated successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Failed to update password.')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="card max-w-3xl">
            <h3 className="text-xl font-semibold">Settings</h3>
            <div className="mt-4 space-y-6">

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Account preferences</h4>
                <div className="mt-2 text-sm text-slate-600">Manage your profile and how others see you.</div>
                <div className="mt-3 flex gap-3">
                  <a href="/profile" className="px-3 py-2 rounded bg-white border">Edit profile</a>
                  <button type="button" className="px-3 py-2 rounded btn-primary">Connect SSO</button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Change Password</h4>
                {pwError && <div className="mt-2 text-sm text-red-600">{pwError}</div>}
                {pwSuccess && <div className="mt-2 text-sm text-green-600">{pwSuccess}</div>}
                <form onSubmit={handlePasswordUpdate} className="mt-3 space-y-2">
                  <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="px-3 py-2 border rounded-lg w-full"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="px-3 py-2 border rounded-lg w-full"
                  />
                  <button type="submit" className="btn-primary" disabled={pwSaving}>
                    {pwSaving ? 'Saving…' : 'Update Password'}
                  </button>
                </form>
              </div>

              <div className="bg-slate-50 p-4 rounded">
                <h4 className="font-medium">Notifications</h4>
                <div className="mt-2 text-sm text-slate-600">Toggle email and in-app notifications.</div>
                <div className="mt-3 flex flex-col gap-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} />
                    <span>Email notifications</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" checked={inAppNotif} onChange={e => setInAppNotif(e.target.checked)} />
                    <span>In-app notifications</span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
