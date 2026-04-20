import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axios'

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', faculty: user?.faculty || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      await axiosInstance.put('/users/profile/me', { name: form.name, faculty: form.faculty })
      await fetchProfile()
      setSuccess('Profile updated successfully.')
      setEditing(false)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {success && <div className="mb-4 text-green-600 bg-green-50 px-4 py-2 rounded">{success}</div>}
          {error && <div className="mb-4 text-red-600 bg-red-50 px-4 py-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-1">
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-sportgreen flex items-center justify-center text-white text-3xl">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{user?.name}</div>
                  <div className="text-sm text-slate-500">{user?.email}</div>
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Role: <span className="font-medium">{user?.role || 'member'}</span>
                </div>
              </div>
            </div>

            <div className="card lg:col-span-2">
              <h3 className="text-xl font-semibold">Profile</h3>
              <div className="mt-4">
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="text-sm">Full name</label>
                      <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm">Faculty</label>
                      <input
                        value={form.faculty}
                        onChange={e => setForm({ ...form, faculty: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button type="button" className="px-3 py-2" onClick={() => setEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-500">Full Name</div>
                        <div className="font-medium">{user?.name || '—'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Student ID</div>
                        <div className="font-medium">{user?.studentId || '—'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Faculty</div>
                        <div className="font-medium">{user?.faculty || '—'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Email</div>
                        <div className="font-medium">{user?.email || '—'}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setForm({ name: user?.name || '', faculty: user?.faculty || '' })
                          setEditing(true)
                        }}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
