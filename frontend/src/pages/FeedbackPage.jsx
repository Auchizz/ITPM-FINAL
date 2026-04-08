import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import activityApi from '../api/activityApi'

export default function FeedbackPage() {
  const [participations, setParticipations] = useState([])
  const [feedbackList, setFeedbackList] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    participation: '',
    targetName: '',
    targetType: 'sport',
    rating: 5,
    title: '',
    message: ''
  })

  async function loadData() {
    try {
      const [participationData, feedbackData] = await Promise.all([
        activityApi.getParticipations(),
        activityApi.getFeedback()
      ])
      setParticipations(participationData)
      setFeedbackList(feedbackData)
    } catch (loadError) {
      setError('Unable to load feedback data right now.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const eligibleParticipations = useMemo(
    () => participations.filter((item) => ['approved', 'completed'].includes(item.status)),
    [participations]
  )

  const selectParticipation = (id) => {
    const selected = eligibleParticipations.find((item) => item.id === id)
    if (!selected) {
      setForm((current) => ({ ...current, participation: id, targetName: '', targetType: 'sport' }))
      return
    }
    setForm((current) => ({
      ...current,
      participation: id,
      targetName: selected.targetName,
      targetType: selected.targetType
    }))
  }

  const submitFeedback = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      setMessage('')
      setError('')
      await activityApi.submitFeedback({
        participation: form.participation || null,
        targetName: form.targetName,
        targetType: form.targetType,
        rating: Number(form.rating),
        title: form.title,
        message: form.message
      })
      setMessage('Feedback submitted.')
      setForm({
        participation: '',
        targetName: '',
        targetType: 'sport',
        rating: 5,
        title: '',
        message: ''
      })
      loadData()
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Unable to submit feedback.')
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
            <h2 className="mt-2 text-3xl font-black tracking-tight text-primary">Feedback System</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f675d]">
              This page is separate from the sports module and lets users record feedback based on approved or completed participation history.
            </p>
          </section>

          {message ? <div className="rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">{message}</div> : null}
          {error ? <div className="rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{error}</div> : null}

          <section className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">New Feedback</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Submit Feedback</h3>

              <form className="mt-6 grid gap-4" onSubmit={submitFeedback}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-primary">Participation Record</span>
                  <select className="input" value={form.participation} onChange={(event) => selectParticipation(event.target.value)}>
                    <option value="">Select approved/completed participation</option>
                    {eligibleParticipations.map((item) => (
                      <option key={item.id} value={item.id}>{item.targetName} - {item.status}</option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-[1fr,180px]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Title</span>
                    <input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-primary">Rating</span>
                    <select className="input" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
                      {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-primary">Message</span>
                  <textarea className="input min-h-32" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
                </label>

                <button type="submit" className="btn-primary w-fit" disabled={submitting || !form.targetName}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>

            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">History</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Feedback Records</h3>

              <div className="mt-6 space-y-4">
                {feedbackList.length > 0 ? feedbackList.map((item) => (
                  <article key={item.id} className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-bold text-primary">{item.title}</div>
                      <div className="badge">{item.rating}/5</div>
                    </div>
                    <div className="mt-2 text-sm text-[#6f675d]">{item.targetName}</div>
                    <p className="mt-3 text-sm leading-6 text-[#6f675d]">{item.message}</p>
                  </article>
                )) : (
                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 text-sm text-[#6f675d]">
                    No feedback submitted yet.
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
