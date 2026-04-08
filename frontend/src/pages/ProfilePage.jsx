<<<<<<< HEAD
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState({ firstName: user?.firstName||'', lastName: user?.lastName||'', faculty: user?.faculty||'', email: user?.email||'' })
  const [saved,   setSaved]   = useState(false)

  function handleSave() {
    updateUser(form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const initials = `${user?.firstName?.[0]||''}${user?.lastName?.[0]||''}`.toUpperCase() || 'A'

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          My Profile
        </h2>
        <span className="badge badge-admin text-xs px-3 py-1">⚡ Admin</span>
      </div>

      {saved && (
        <div className="mb-5 p-3 rounded-xl bg-unigreen-pale text-unigreen text-sm font-semibold border border-green-200">
          ✓ Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

        {/* Left card */}
        <div className="card text-center p-6">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-extrabold text-white"
            style={{ background:'linear-gradient(135deg,#1E3A8A,#16A34A)', boxShadow:'0 6px 20px rgba(30,58,138,.25)' }}>
            {initials}
          </div>
          <div className="font-display font-bold text-lg text-slate-900 mb-0.5">{user?.firstName} {user?.lastName}</div>
          <div className="text-xs text-slate-400 mb-3">{user?.email||'—'}</div>
          <div className="badge badge-admin text-xs px-3 py-1 mb-5">⚡ Administrator</div>

          <div className="flex justify-around py-4 border-y border-slate-100 mb-5">
            {[['24','Sessions'],['3','Years'],['142','Actions']].map(([n,l])=>(
              <div key={l} className="text-center">
                <div className="text-xl font-extrabold text-slate-900">{n}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setEditing(e => !e)} className="btn-primary w-full py-2.5 text-sm">
            {editing ? 'Cancel Edit' : '✏️ Edit Profile'}
          </button>
        </div>

        {/* Right info */}
        <div className="space-y-4">

          {/* Info / Edit form */}
          <div className="card">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">
              {editing ? 'Edit Information' : 'Personal Information'}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {['firstName','lastName'].map(f => (
                    <div key={f}>
                      <label className="form-label">{f==='firstName'?'First':'Last'} Name</label>
                      <input value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                        className="form-input" placeholder={f==='firstName'?'First name':'Last name'}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="form-label">Faculty / Department</label>
                  <input value={form.faculty} onChange={e => setForm(p=>({...p,faculty:e.target.value}))}
                    className="form-input" placeholder="e.g. Faculty of Engineering"/>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                    className="form-input" placeholder="your@university.edu"/>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} className="btn-primary px-6 py-2.5 text-sm">💾 Save Changes</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['First Name', user?.firstName],['Last Name', user?.lastName],
                  ['Student / Staff ID', user?.studentId],['Faculty / Department', user?.faculty],
                  ['Email', user?.email],['Role', user?.role === 'admin' ? 'Administrator ⚡' : user?.role],
                  ['Account Created', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '—'],
                  ['Last Login', 'Today'],
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lbl}</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">{val||'—'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Recent Activity</div>
            <div className="space-y-2.5">
              {[
                { icon:'🔑', bg:'bg-primary-pale',    title:'Logged in',          sub:'Today — from campus network' },
                { icon:'📢', bg:'bg-unigreen-pale',   title:'Posted announcement', sub:'Yesterday — Exam Timetable Published' },
                { icon:'🏆', bg:'bg-accent-pale',     title:'Created event',       sub:'2 days ago — Annual Research Symposium' },
                { icon:'⚙️', bg:'bg-blue-50',          title:'Updated settings',    sub:'3 days ago — Notification preferences changed' },
              ].map((a,i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-full ${a.bg} flex items-center justify-center text-sm flex-shrink-0`}>{a.icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-700">{a.title}</div>
                    <div className="text-[10.5px] text-slate-400">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
=======
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
>>>>>>> origin/main
  )
}
