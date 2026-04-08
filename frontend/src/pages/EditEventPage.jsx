import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import eventApi from '../api/eventApi'
import { useAuth } from '../context/AuthContext'

export default function EditEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    status: 'Upcoming',
    image: null
  })

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/events')
      return
    }
    loadEvent()
  }, [user, id, navigate])

  async function loadEvent() {
    try {
      setLoading(true)
      const res = await eventApi.getEventById(id)
      const event = res.data
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        venue: event.venue || '',
        capacity: event.capacity || '',
        status: event.status || 'Upcoming',
        image: null
      })
      
      if (event.image) {
        setImagePreview(`http://localhost:5004/${event.image}`)
      }
    } catch (err) {
      console.error(err)
      setMessage('Failed to load event details.')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value, files } = e.target
    if (name === 'image' && files?.[0]) {
      const file = files[0]
      setFormData(prev => ({ ...prev, image: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    
    if (!formData.title || !formData.description || !formData.date || !formData.venue || !formData.capacity) {
      setMessage('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      setMessage('')
      
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('date', formData.date)
      submitData.append('venue', formData.venue)
      submitData.append('capacity', formData.capacity)
      submitData.append('status', formData.status)
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }

      console.log('Sending update request for event ID:', id)
      console.log('FormData contents:')
      for (let [key, value] of submitData.entries()) {
        console.log(key, value)
      }

      const result = await eventApi.updateEvent(id, submitData)
      console.log('Update result:', result)
      
      setMessage('Event updated successfully!')
      setTimeout(() => navigate('/events'), 1500)
    } catch (err) {
      console.error('Update error:', err)
      console.error('Error response:', err?.response?.data)
      setMessage(err?.response?.data?.message || 'Failed to update event.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Sidebar className="relative z-20" />
        <div className="flex-1 relative z-10">
          <Navbar />
          <main className="p-6">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading event...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Sidebar className="relative z-20" />
      <div className="flex-1 relative z-10">
        <Navbar />
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => navigate('/events')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.includes('success') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
                    placeholder="Enter event description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                      placeholder="Enter venue"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                      placeholder="Enter capacity"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Open">Open</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Image
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: null }))
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {submitting ? 'Updating...' : 'Update Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}