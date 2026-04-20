import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import eventApi from '../api/eventApi'
import registrationApi from '../api/registrationApi'
import { useAuth } from '../context/AuthContext'

export default function EventsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [myEventIds, setMyEventIds] = useState(new Set())
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [registeringId, setRegisteringId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    loadMyRegistrations()
  }, [user?.email])

  async function loadEvents() {
    try {
      setLoading(true)
      const res = await eventApi.getEvents()
      setEvents(res?.data || [])
    } catch (err) {
      console.error(err)
      setMessage('Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  async function loadMyRegistrations() {
    if (!user?.email) return
    try {
      console.log('🔄 Loading registrations for user:', user.email)
      const res = await registrationApi.getMyRegistrations()
      console.log('📋 My registrations response:', res)
      const ids = new Set((res?.data || []).map((item) => item?.event?._id).filter(Boolean))
      console.log('📊 Registered event IDs:', Array.from(ids))
      setMyEventIds(ids)
    } catch (err) {
      console.error('❌ Error loading registrations:', err)
      setMyEventIds(new Set())
    }
  }

  async function handleRegister(event) {
    console.log('🔄 Register button clicked for event:', event)
    console.log('👤 Current user:', user)

    if (!user) {
      console.log('❌ No user found, redirecting to login')
      navigate('/login')
      return
    }

    if (myEventIds.has(event._id)) {
      console.log('⚠️ User already registered for this event')
      setMessage('You have already registered for this event.')
      return
    }

    try {
      setRegisteringId(event._id)
      setMessage('')

      const registrationData = {
        eventId: event._id,
        studentName: user.name,
        studentId: user.studentId || user._id || user.email,
        email: user.email,
        faculty: user.faculty || 'N/A',
        phone: 'N/A'
      }

      console.log('📤 Sending registration data:', registrationData)

      const result = await registrationApi.registerStudent(registrationData)
      console.log('✅ Registration result:', result)

      setMessage('Registration successful! Check "My Events" to see your registered events.')
      setMyEventIds((prev) => new Set([...prev, event._id]))

      // Reload both events and registrations to ensure UI is updated
      console.log('🔄 Reloading events and registrations...')
      await Promise.all([loadEvents(), loadMyRegistrations()])
      console.log('✅ Data reloaded successfully')

      // Show success message for longer
      setTimeout(() => setMessage(''), 5000)

    } catch (err) {
      console.error('❌ Registration error:', err)
      console.error('📋 Error response:', err?.response?.data)

      const apiMessage = err?.response?.data?.message
      if ((apiMessage || '').toLowerCase().includes('already registered')) {
        setMyEventIds((prev) => new Set([...prev, event._id]))
        setMessage('You are already registered for this event.')
      } else {
        setMessage(apiMessage || 'Registration failed. Please try again.')
      }
    } finally {
      setRegisteringId('')
    }
  }

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (status && event.status !== status) return false
      if (query && !`${event.title} ${event.description} ${event.venue}`.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      return true
    })
  }, [events, query, status])

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Sidebar className="relative z-20" />
      <div className="flex-1 relative z-10">
        <Navbar />
        <main className="p-6">
          {/* Hero Section */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="h-96 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-indigo-900/80" />
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-4xl mx-auto px-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h1 className="text-5xl font-bold mb-4 leading-tight">
                        MADE FOR<br />
                        THOSE<br />
                        WHO DO
                      </h1>
                      <p className="text-xl opacity-90 mb-6">Discover amazing events and experiences</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
              {user?.role === 'admin' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/events/create')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </button>
                  <button
                    onClick={() => navigate('/registrations')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-colors font-semibold"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Registrations
                  </button>
                </div>
              )}
              {user?.role !== 'admin' && (
                <button
                  onClick={() => navigate('/my-events')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-colors font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Events
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none min-w-64"
              />
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl ${message.includes('successful')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
              <div className="flex items-center justify-between">
                <span>{message}</span>
                {message.includes('successful') && (
                  <button
                    onClick={() => navigate('/my-events')}
                    className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    View My Events
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onRegister={handleRegister}
                  registering={registeringId === event._id}
                  isRegistered={myEventIds.has(event._id)}
                  isAdmin={user?.role === 'admin'}
                />
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
