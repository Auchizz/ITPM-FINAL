import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import registrationApi from '../api/registrationApi'
import { useAuth } from '../context/AuthContext'

export default function MyEventsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadMyEvents()
  }, [user?.email])

  // Auto-refresh when the page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.email) {
        loadMyEvents()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user?.email])

  async function loadMyEvents() {
    if (!user?.email) {
      console.log('❌ No user email found, cannot load events')
      return
    }
    try {
      setLoading(true)
      setMessage('')
      console.log('🔄 Loading events for user:', user.email)
      const res = await registrationApi.getMyRegistrations()
      console.log('📋 Registration API response:', res)
      console.log('📊 Raw registration data:', res?.data)
      
      // Filter out registrations where the event has been deleted
      const validItems = (res?.data || []).filter(item => {
        const isValid = item.event && item.event._id
        if (!isValid) {
          console.log('⚠️ Filtering out invalid item:', item)
        }
        return isValid
      })
      console.log('✅ Valid items after filtering:', validItems)
      console.log('📈 Total valid registrations:', validItems.length)
      setItems(validItems)
    } catch (err) {
      console.error('❌ Error loading my events:', err)
      console.error('📋 Error response:', err?.response?.data)
      setItems([])
      setMessage(err?.response?.data?.message || 'Failed to load your events.')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Sidebar className="relative z-20" />
      <div className="flex-1 relative z-10">
        <Navbar />
        <main className="p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">My Registered Events</h2>
              <button
                onClick={loadMyEvents}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                {message}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading your events...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No registered events</h3>
                <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                <button
                  onClick={() => window.location.href = '/events'}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.map((item) => (
                  <div key={item._id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{item.event?.title || 'Unknown Event'}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.event?.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            item.event?.status === 'Open' ? 'bg-green-100 text-green-800' :
                            item.event?.status === 'Ongoing' ? 'bg-orange-100 text-orange-800' :
                            item.event?.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                            item.event?.status === 'Closed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.event?.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span><strong>Venue:</strong> {item.event?.venue || 'TBA'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
                            </svg>
                            <span><strong>Date:</strong> {item.event?.date ? new Date(item.event.date).toLocaleString() : 'TBA'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span><strong>Status:</strong> 
                              <span className={`ml-1 font-semibold ${
                                item.status === 'Confirmed' ? 'text-green-600' :
                                item.status === 'Pending' ? 'text-yellow-600' :
                                'text-gray-600'
                              }`}>
                                {item.status || 'Registered'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => window.location.href = `/events/${item.event?._id}`}
                          className="bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
