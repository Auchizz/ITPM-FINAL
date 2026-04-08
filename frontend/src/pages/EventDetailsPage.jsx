import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import eventApi from '../api/eventApi'
import registrationApi from '../api/registrationApi'
import { useAuth } from '../context/AuthContext'

export default function EventDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 150) + 50)

  useEffect(() => {
    loadEvent()
  }, [id])

  useEffect(() => {
    if (user?.role === 'admin') {
      loadJoinedStudents()
    }
  }, [id, user?.role])

  async function loadEvent() {
    try {
      setLoading(true)
      setError('')
      const res = await eventApi.getEventById(id)
      setEvent(res?.data || null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load event details.')
    } finally {
      setLoading(false)
    }
  }

  async function loadJoinedStudents() {
    try {
      setStudentsLoading(true)
      const res = await registrationApi.getRegistrationsByEvent(id)
      setStudents(res?.data || [])
    } catch (err) {
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  async function handleStatusChange(newStatus) {
    if (!event || newStatus === event.status) return

    try {
      setStatusUpdating(true)
      setStatusMessage('')

      await eventApi.updateEvent(id, { status: newStatus })

      setEvent(prev => ({ ...prev, status: newStatus }))
      setStatusMessage('Status updated successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000)
    } catch (err) {
      setStatusMessage(err?.response?.data?.message || 'Failed to update status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  async function handleDeleteEvent() {
    if (!event || !['Completed', 'Cancelled'].includes(event.status)) return

    try {
      setDeleting(true)
      await eventApi.deleteEvent(id)
      navigate('/events')
    } catch (err) {
      setStatusMessage(err?.response?.data?.message || 'Failed to delete event.')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading event details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-red-600 text-lg font-semibold">{error}</div>
            </div>
          ) : !event ? (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
              <div className="text-gray-600 text-lg">Event not found.</div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Event Image */}
                <div className="relative h-80 overflow-hidden">
                  {event?.image ? (
                    <img
                      src={`http://localhost:5004/${event.image}`}
                      alt={event?.title || 'Event image'}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
                      }}
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Top actions */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-sm font-bold text-gray-900">FREE</span>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${event.status === 'Open' ? 'bg-green-100/90 text-green-800' :
                          event.status === 'Upcoming' ? 'bg-blue-100/90 text-blue-800' :
                            event.status === 'Ongoing' ? 'bg-orange-100/90 text-orange-800' :
                              event.status === 'Completed' ? 'bg-purple-100/90 text-purple-800' :
                                event.status === 'Cancelled' ? 'bg-red-100/90 text-red-800' :
                                  'bg-gray-100/90 text-gray-800'
                        }`}>
                        {event.status}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setIsLiked(!isLiked)
                          setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
                        }}
                        className={`backdrop-blur-sm p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${isLiked
                            ? 'bg-red-500/90 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                      >
                        <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                        <div className="flex items-center gap-2 text-white/90">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="font-medium">{likeCount} likes</span>
                        </div>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="flex flex-col items-end gap-2">
                          <select
                            value={event.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={statusUpdating}
                            className="px-4 py-2 rounded-xl border-2 border-white bg-white text-gray-900 text-sm font-medium min-w-[140px] focus:ring-2 focus:ring-purple-500 shadow-lg [&>option]:bg-white [&>option]:text-gray-900"
                            style={{ 
                              backgroundColor: 'white !important', 
                              color: '#111827 !important',
                              colorScheme: 'light',
                              border: '2px solid white'
                            }}
                          >
                            <option value="Upcoming" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Upcoming</option>
                            <option value="Open" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Open</option>
                            <option value="Closed" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Closed</option>
                            <option value="Ongoing" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Ongoing</option>
                            <option value="Completed" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Completed</option>
                            <option value="Cancelled" style={{ backgroundColor: 'white !important', color: '#111827 !important' }}>Cancelled</option>
                          </select>
                          {statusUpdating && <span className="text-xs text-white/80">Updating...</span>}
                          {statusMessage && (
                            <span className={`text-xs ${statusMessage.includes('success') ? 'text-green-300' : 'text-red-300'}`}>
                              {statusMessage}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-8">
                  <div className="mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">{event.description}</p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Venue */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-purple-600">Venue</div>
                      </div>
                      <div className="font-semibold text-gray-900">{event.venue}</div>
                    </div>

                    {/* Date */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-blue-600">Date</div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Registration Deadline */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-orange-600">Registration Deadline</div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(event.registrationDeadline).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="text-sm font-medium text-green-600">Capacity</div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {event.registeredCount}/{event.capacity} participants
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <Link
                      to="/events"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to events
                    </Link>

                    {user?.role === 'admin' && ['Completed', 'Cancelled'].includes(event.status) && (
                      <div>
                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 transition-colors font-medium"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Event
                          </button>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-red-600 font-medium">Are you sure?</span>
                            <button
                              onClick={handleDeleteEvent}
                              disabled={deleting}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50 font-medium"
                            >
                              {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Students Section for Admin */}
              {user?.role === 'admin' && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-indigo-100 rounded-xl">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Registered Students</h3>
                        <p className="text-gray-600">Manage event participants and attendance</p>
                      </div>
                    </div>

                    {studentsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading students...</p>
                        </div>
                      </div>
                    ) : students.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No students registered yet</h4>
                        <p className="text-gray-600">Students will appear here once they register for this event.</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Faculty</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {students.map((student, index) => (
                                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {student.studentName?.charAt(0)?.toUpperCase() || 'S'}
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900">{student.studentName}</div>
                                        <div className="text-sm text-gray-500">Registered {new Date(student.createdAt || Date.now()).toLocaleDateString()}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{student.studentId}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {student.faculty}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${student.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                        student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                      }`}>
                                      {student.status || 'Registered'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Total: {students.length} student{students.length !== 1 ? 's' : ''} registered
                            </span>
                            <span className="text-gray-600">
                              Capacity: {event.registeredCount}/{event.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
