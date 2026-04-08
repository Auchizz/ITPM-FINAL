import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import userApi from '../api/userApi'
import { useAuth } from '../context/AuthContext'

const emptyAdminForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  studentId: '',
  faculty: '',
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-primary">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
      />
    </label>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, fetchProfile, setUser, logout } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [teamMessage, setTeamMessage] = useState('')
  const [teamError, setTeamError] = useState('')
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [managedUserId, setManagedUserId] = useState(null)
  const [adminForm, setAdminForm] = useState(emptyAdminForm)
  const [adminBusy, setAdminBusy] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    faculty: '',
    studentId: '',
    password: '',
  })

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      faculty: user?.faculty || '',
      studentId: user?.studentId || '',
      password: '',
    })
  }, [user])

  useEffect(() => {
    if (isAdmin) loadUsers()
  }, [isAdmin])

  async function loadUsers() {
    try {
      setLoadingUsers(true)
      const response = await userApi.getUsers()
      setUsers(response?.data || [])
    } catch (err) {
      setTeamError(err?.response?.data?.message || 'Unable to load profiles')
    } finally {
      setLoadingUsers(false)
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setFeedback('')
    setError('')

    try {
      const payload = {
        name: form.name,
        email: form.email,
        faculty: form.faculty,
        studentId: form.studentId,
      }
      if (form.password.trim()) payload.password = form.password

      const response = await userApi.updateMyProfile(payload)
      setUser(response?.data || null)
      await fetchProfile()
      setEditing(false)
      setForm((current) => ({ ...current, password: '' }))
      setFeedback('Profile updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteMyProfile() {
    if (!window.confirm('Delete your profile permanently? This will log you out.')) return

    try {
      await userApi.deleteMyProfile()
      logout()
      navigate('/register')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete profile')
    }
  }

  function beginManageUser(selectedUser) {
    setManagedUserId(selectedUser?._id || null)
    setAdminForm({
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      password: '',
      role: selectedUser?.role || 'student',
      studentId: selectedUser?.studentId || '',
      faculty: selectedUser?.faculty || '',
    })
    setTeamMessage(selectedUser ? `Editing ${selectedUser.name}` : 'Creating a new profile')
    setTeamError('')
  }

  async function handleAdminSubmit(event) {
    event.preventDefault()
    setAdminBusy(true)
    setTeamMessage('')
    setTeamError('')

    try {
      const payload = {
        name: adminForm.name,
        email: adminForm.email,
        role: adminForm.role,
        studentId: adminForm.studentId,
        faculty: adminForm.faculty,
      }

      if (adminForm.password.trim()) payload.password = adminForm.password

      if (managedUserId) {
        await userApi.updateUser(managedUserId, payload)
        setTeamMessage('Profile updated.')
      } else {
        if (!payload.password) {
          setTeamError('Password is required when creating a profile.')
          setAdminBusy(false)
          return
        }
        await userApi.createUser(payload)
        setTeamMessage('Profile created.')
      }

      beginManageUser(null)
      await loadUsers()
    } catch (err) {
      setTeamError(err?.response?.data?.message || 'Unable to save profile')
    } finally {
      setAdminBusy(false)
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this profile?')) return

    try {
      await userApi.deleteUser(id)
      if (id === managedUserId) beginManageUser(null)
      if (id === user?._id) {
        logout()
        navigate('/login')
        return
      }
      setTeamMessage('Profile deleted.')
      await loadUsers()
    } catch (err) {
      setTeamError(err?.response?.data?.message || 'Unable to delete profile')
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((entry) => {
      if (roleFilter && entry.role !== roleFilter) return false
      if (query) {
        const haystack = `${entry.name} ${entry.email} ${entry.studentId || ''} ${entry.faculty || ''}`.toLowerCase()
        if (!haystack.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [users, query, roleFilter])

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="space-y-6 px-4 py-6 md:px-8">
          <section className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
            <div className="card overflow-hidden bg-gradient-to-br from-primary via-[#224764] to-sportgreen text-[#fff8ef]">
              <div className="relative">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#fff8ef]/10 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex rounded-full border border-[#fff8ef]/10 bg-[#fff8ef]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#fff8ef]/70">
                    Identity
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#fff8ef] text-4xl font-black text-primary shadow-2xl shadow-[rgba(23,50,77,0.18)]">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">{user?.name || 'User'}</h2>
                      <p className="mt-1 text-sm text-[#fff8ef]/75">{user?.email}</p>
                      <div className="mt-3 inline-flex rounded-full border border-[#fff8ef]/10 bg-[#fff8ef]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#fff8ef]/75">
                        {user?.role || 'student'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-[#fff8ef]/10 bg-[#fff8ef]/10 p-4">
                      <div className="text-xs uppercase tracking-[0.28em] text-[#fff8ef]/55">Student ID</div>
                      <div className="mt-2 text-lg font-bold">{user?.studentId || 'Pending'}</div>
                    </div>
                    <div className="rounded-[24px] border border-[#fff8ef]/10 bg-[#fff8ef]/10 p-4">
                      <div className="text-xs uppercase tracking-[0.28em] text-[#fff8ef]/55">Faculty</div>
                      <div className="mt-2 text-lg font-bold">{user?.faculty || 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">My profile</div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Edit profile details</h3>
                </div>
                {!editing ? (
                  <button className="btn-primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                ) : null}
              </div>

              {feedback ? <div className="mt-5 rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">{feedback}</div> : null}
              {error ? <div className="mt-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{error}</div> : null}

              {editing ? (
                <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
                  <Field label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
                  <Field label="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Enter email" />
                  <Field label="Faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="Engineering, Science..." />
                  <Field label="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="ST-2026-001" />
                  <div className="md:col-span-2">
                    <Field label="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Leave blank to keep current password" />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <button type="submit" className="btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-primary"
                      onClick={() => {
                        setEditing(false)
                        setError('')
                        setForm({
                          name: user?.name || '',
                          email: user?.email || '',
                          faculty: user?.faculty || '',
                          studentId: user?.studentId || '',
                          password: '',
                        })
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ['Full name', user?.name || 'Not set'],
                    ['Email address', user?.email || 'Not set'],
                    ['Faculty', user?.faculty || 'Not set'],
                    ['Student ID', user?.studentId || 'Not set'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7d69]">{label}</div>
                      <div className="mt-2 text-lg font-bold text-primary">{value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="card bg-gradient-to-br from-[#fffaf2] via-[#f7efe3] to-[#efe5d6]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Security</div>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Profile controls</h3>
                </div>
                <button
                  onClick={handleDeleteMyProfile}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-5 py-3 text-sm font-semibold text-danger transition hover:border-[#d6a79e] hover:bg-[#f4d8d3]"
                >
                  Delete My Profile
                </button>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f675d]">
                Editing is now connected to the backend. Deleting your profile removes your account and ends the current session immediately.
              </p>
            </div>
          </section>

          {isAdmin ? (
            <section className="grid gap-6 xl:grid-cols-[0.95fr,1.45fr]">
              <div className="card">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Admin studio</div>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">
                  {managedUserId ? 'Update profile' : 'Add profile'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#6f675d]">
                  User management is now handled directly here. Create, edit, and delete profiles without a separate sidebar tab.
                </p>

                {teamMessage ? <div className="mt-5 rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">{teamMessage}</div> : null}
                {teamError ? <div className="mt-5 rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{teamError}</div> : null}

                <form className="mt-6 space-y-4" onSubmit={handleAdminSubmit}>
                  <Field label="Full name" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} placeholder="Enter member name" />
                  <Field label="Email address" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} type="email" placeholder="Enter member email" />
                  <Field label={managedUserId ? 'Reset password' : 'Password'} value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} type="password" placeholder={managedUserId ? 'Leave blank to keep current password' : 'Enter temporary password'} />
                  <Field label="Student ID" value={adminForm.studentId} onChange={(e) => setAdminForm({ ...adminForm, studentId: e.target.value })} placeholder="Student number" />
                  <Field label="Faculty" value={adminForm.faculty} onChange={(e) => setAdminForm({ ...adminForm, faculty: e.target.value })} placeholder="Faculty" />
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Role</span>
                    <select
                      value={adminForm.role}
                      onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                      className="input"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="btn-primary" disabled={adminBusy}>
                      {adminBusy ? 'Saving...' : managedUserId ? 'Update Profile' : 'Add Profile'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-5 py-3 text-sm font-semibold text-primary"
                      onClick={() => beginManageUser(null)}
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Directory</div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Manage all profiles</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search name, email, faculty..."
                      className="input min-w-[220px]"
                    />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input">
                      <option value="">All roles</option>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] border border-[#eee3d3]">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead className="bg-[#f8f1e7]">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Faculty</th>
                          <th>Student ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingUsers ? (
                          <tr>
                            <td colSpan="6" className="text-center text-[#7d7467]">Loading profiles...</td>
                          </tr>
                        ) : filteredUsers.length ? (
                          filteredUsers.map((entry) => (
                            <tr key={entry._id}>
                              <td className="font-semibold text-primary">{entry.name}</td>
                              <td>{entry.email}</td>
                              <td>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${entry.role === 'admin' ? 'bg-primary text-[#fff8ef]' : 'bg-[#efe3d3] text-primary'}`}>
                                  {entry.role}
                                </span>
                              </td>
                              <td>{entry.faculty || 'Not set'}</td>
                              <td>{entry.studentId || 'Not set'}</td>
                              <td>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => beginManageUser(entry)}
                                    className="rounded-xl border border-[#d8c6ab] px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:text-primary"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(entry._id)}
                                    className="rounded-xl border border-[#e5c0b9] bg-[#f8e7e4] px-3 py-2 text-xs font-semibold text-danger transition hover:border-[#d6a79e] hover:bg-[#f4d8d3]"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-[#7d7467]">No profiles found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}
