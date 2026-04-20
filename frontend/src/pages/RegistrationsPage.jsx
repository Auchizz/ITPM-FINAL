import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import eventApi from '../api/eventApi'
import registrationApi from '../api/registrationApi'

export default function RegistrationsPage() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedEventId) {
      loadRegistrations(selectedEventId)
    } else {
      setRegistrations([])
    }
  }, [selectedEventId])

  async function loadEvents() {
    try {
      const res = await eventApi.getEvents()
      const items = res?.data || []
      setEvents(items)
      if (items.length > 0) setSelectedEventId(items[0]._id)
    } catch (err) {
      setMessage('Failed to load events.')
    }
  }

  async function loadRegistrations(eventId) {
    try {
      setLoading(true)
      setMessage('')
      const res = await registrationApi.getRegistrationsByEvent(eventId)
      setRegistrations(res?.data || [])
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to load registrations.')
    } finally {
      setLoading(false)
    }
  }

  async function cancelRegistration(id) {
    const ok = window.confirm('Cancel this registration?')
    if (!ok) return

    try {
      await registrationApi.cancelRegistration(id)
      await loadRegistrations(selectedEventId)
      setMessage('Registration cancelled.')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to cancel registration.')
    }
  }

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold">Registrations</h2>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>

            {message && <p className="mb-4 text-sm text-slate-700">{message}</p>}

            {loading ? (
              <div>Loading registrations...</div>
            ) : registrations.length === 0 ? (
              <div>No registrations found for this event.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-slate-500 text-sm">
                    <tr>
                      <th className="py-2">Student Name</th>
                      <th>Student ID</th>
                      <th>Email</th>
                      <th>Faculty</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50">
                        <td className="py-2">{item.studentName}</td>
                        <td>{item.studentId}</td>
                        <td>{item.email}</td>
                        <td>{item.faculty}</td>
                        <td>{item.status}</td>
                        <td>
                          <button
                            onClick={() => cancelRegistration(item._id)}
                            className="px-3 py-1 rounded bg-red-500 text-white disabled:opacity-50"
                            disabled={item.status === 'Cancelled'}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
