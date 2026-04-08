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
  )
}
