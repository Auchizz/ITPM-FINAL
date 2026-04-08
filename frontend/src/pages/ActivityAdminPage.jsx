import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import activityApi from '../api/activityApi'

export default function ActivityAdminPage() {
  const [participations, setParticipations] = useState([])
  const [feedbackList, setFeedbackList] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadData() {
    try {
      const [participationData, feedbackData] = await Promise.all([
        activityApi.getParticipations(),
        activityApi.getFeedback()
      ])
      setParticipations(participationData)
      setFeedbackList(feedbackData)
    } catch (loadError) {
      setError('Unable to load admin activity data.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      setMessage('')
      setError('')
      await activityApi.updateParticipationStatus(id, { status, adminNotes: '' })
      setMessage(`Participation request marked as ${status}.`)
      loadData()
    } catch (actionError) {
      setError(actionError?.response?.data?.message || 'Unable to update participation status.')
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
            <h2 className="mt-2 text-3xl font-black tracking-tight text-primary">Activity Admin Review</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f675d]">
              This admin page reviews the separate participation, feedback, and notification features without adding anything into the sports module admin page.
            </p>
          </section>

          {message ? <div className="rounded-2xl border border-[#c8d9cc] bg-[#edf5ee] px-4 py-3 text-sm text-sportgreen">{message}</div> : null}
          {error ? <div className="rounded-2xl border border-[#e5c0b9] bg-[#f8e7e4] px-4 py-3 text-sm text-danger">{error}</div> : null}

          <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Participation Review</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Requests</h3>

              <div className="mt-6 space-y-4">
                {participations.length > 0 ? participations.map((item) => (
                  <article key={item.id} className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-bold text-primary">{item.targetName}</div>
                        <div className="mt-1 text-sm text-[#6f675d]">{item.fullName} • {item.targetType} • {item.preferredRole}</div>
                      </div>
                      <div className="badge">{item.status}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#6f675d]">{item.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['approved', 'declined', 'completed'].map((status) => (
                        <button
                          key={status}
                          className="inline-flex items-center justify-center rounded-2xl border border-[#d8c6ab] bg-[#fffdf8] px-4 py-2 text-sm font-semibold text-primary"
                          onClick={() => updateStatus(item.id, status)}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </article>
                )) : (
                  <div className="rounded-[24px] border border-[#eee3d3] bg-[#f8f1e7]/80 p-4 text-sm text-[#6f675d]">
                    No participation requests yet.
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c7d69]">Feedback Review</div>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">User Feedback</h3>

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
                    No feedback records yet.
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
