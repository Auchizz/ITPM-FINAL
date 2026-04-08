import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import activityApi from '../api/activityApi'

export default function ParticipationPage() {
  const [catalog, setCatalog] = useState({ sports: [], clubs: [] })
  const [participations, setParticipations] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    targetType: 'sport',
    targetName: '',
    preferredRole: 'Member',
    fullName: '',
    studentId: '',
    email: '',
    message: ''
  })

  async function loadData() {
    try {
      const [catalogData, participationData] = await Promise.all([
        activityApi.getCatalog(),
        activityApi.getParticipations()
      ])
      setCatalog(catalogData)
      setParticipations(participationData)
    } catch (loadError) {
      setError('Unable to load participation data right now.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const targetOptions = useMemo(
    () => form.targetType === 'sport' ? catalog.sports : catalog.clubs,
    [catalog, form.targetType]
  )

  const submitParticipation = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setMessage('')
      setError('')
      await activityApi.createParticipation(form)
      setMessage('Participation request submitted.')
      setForm((current) => ({ ...current, message: '' }))
      loadData()
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Unable to submit participation request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-pagebg md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="space-y-6 px-4 py-6 md:px-8">
          <section className="card">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">My Part</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-primary">Participation Tracking</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f675d]">
              This page is separate from the sports module UI, but it loads sports and clubs from the module data so you can manage participation requests as your own part.
            </p>
          </section>

          {message ? <div className="rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">{message}</div> : null}
          {error ? <div className="rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{error}</div> : null}

          <section className="grid gap-6 xl:grid-cols-[1fr,1.1fr]">
            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">New Request</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Request to Participate</h3>

              <form className="mt-6 grid gap-4" onSubmit={submitParticipation}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Target Type</span>
                    <select className="input" value={form.targetType} onChange={(event) => setForm({ ...form, targetType: event.target.value, targetName: '' })}>
                      <option value="sport">Sport</option>
                      <option value="club">Club</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Target</span>
                    <select className="input" value={form.targetName} onChange={(event) => setForm({ ...form, targetName: event.target.value })}>
                      <option value="">Select target</option>
                      {targetOptions.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Full Name</span>
                    <input className="input" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Student ID</span>
                    <input className="input" value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Role</span>
                    <select className="input" value={form.preferredRole} onChange={(event) => setForm({ ...form, preferredRole: event.target.value })}>
                      <option value="Member">Member</option>
                      <option value="Captain">Captain</option>
                      <option value="Vice Captain">Vice Captain</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-primary">Email</span>
                  <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-primary">Message</span>
                  <textarea className="input min-h-32" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
                </label>

                <button type="submit" className="btn-primary w-fit" disabled={submitting || !form.targetName}>
                  {submitting ? 'Submitting...' : 'Submit Participation Request'}
                </button>
              </form>
            </div>

            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">History</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Participation History</h3>

              <div className="mt-6 space-y-4">
                {participations.length > 0 ? participations.map((item) => (
                  <article key={item.id} className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7d69]">{item.targetType}</div>
                        <div className="mt-2 text-lg font-bold text-primary">{item.targetName}</div>
                      </div>
                      <div className="badge">{item.status}</div>
                    </div>
                    <div className="mt-3 text-sm text-[#6f675d]">Preferred role: {item.preferredRole}</div>
                    <div className="mt-1 text-sm text-[#6f675d]">Submitted: {new Date(item.createdAt).toLocaleString()}</div>
                    <p className="mt-3 text-sm leading-6 text-[#6f675d]">{item.message}</p>
                    {item.adminNotes ? <div className="mt-3 text-sm font-semibold text-primary">Admin note: {item.adminNotes}</div> : null}
                  </article>
                )) : (
                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 text-sm text-[#6f675d]">
                    No participation requests yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
