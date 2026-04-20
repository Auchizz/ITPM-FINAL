import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import eventApi from '../api/eventApi'

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const dateInputRef = useRef(null)
  const deadlineInputRef = useRef(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    registrationDeadline: '',
    capacity: 100,
    status: 'Upcoming',
    foodAndBeverageAvailable: false,
    foodAndBeverageDetails: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleCalendarClick(inputRef) {
    if (inputRef.current) {
      inputRef.current.showPicker()
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }

      setField('image', file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Clear any previous error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    }
  }

  function removeImage() {
    setField('image', null)
    setImagePreview(null)
  }

  function validateForm() {
    const newErrors = {}

    // Title validation
    if (!form.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long'
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    // Description validation
    if (!form.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (form.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    } else if (form.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    // Venue validation
    if (!form.venue.trim()) {
      newErrors.venue = 'Venue is required'
    } else if (form.venue.trim().length < 2) {
      newErrors.venue = 'Venue must be at least 2 characters long'
    } else if (form.venue.trim().length > 200) {
      newErrors.venue = 'Venue must be less than 200 characters'
    }

    // Date validation
    if (!form.date) {
      newErrors.date = 'Event date is required'
    } else {
      const eventDate = new Date(form.date)
      const now = new Date()
      if (eventDate <= now) {
        newErrors.date = 'Event date must be in the future'
      }
    }

    // Registration deadline validation
    if (!form.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required'
    } else {
      const regDeadline = new Date(form.registrationDeadline)
      const eventDate = new Date(form.date)
      const now = new Date()

      if (regDeadline <= now) {
        newErrors.registrationDeadline = 'Registration deadline must be in the future'
      } else if (form.date && regDeadline >= eventDate) {
        newErrors.registrationDeadline = 'Registration deadline must be before the event date'
      }
    }

    // Capacity validation
    if (!form.capacity || form.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1'
    } else if (form.capacity > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000'
    }

    // Food and beverage details validation
    if (form.foodAndBeverageAvailable && !form.foodAndBeverageDetails.trim()) {
      newErrors.foodAndBeverageDetails = 'Please provide food and beverage details'
    } else if (form.foodAndBeverageDetails.length > 500) {
      newErrors.foodAndBeverageDetails = 'Food and beverage details must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError('')
    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('venue', form.venue)
      formData.append('date', form.date)
      formData.append('registrationDeadline', form.registrationDeadline)
      formData.append('capacity', Number(form.capacity))
      formData.append('status', form.status)
      formData.append('foodAndBeverage', JSON.stringify({
        available: form.foodAndBeverageAvailable,
        details: form.foodAndBeverageDetails
      }))
      
      // Add image if selected
      if (form.image) {
        formData.append('image', form.image)
      }

      await eventApi.createEventWithImage(formData)
      navigate('/events')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-pagebg">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="card max-w-3xl">
            <h2 className="text-2xl font-bold">Create Event</h2>
            {error && <p className="mt-3 text-danger">{error}</p>}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  rows={4}
                  required
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              
              {/* Event Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700">Event Image</label>
                <div className="mt-1">
                  {!imagePreview ? (
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload an image</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Venue</label>
                  <input
                    value={form.venue}
                    onChange={(e) => setField('venue', e.target.value)}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.venue ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
                </div>
                <div>
                  <label className="text-sm">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setField('capacity', e.target.value)}
                    className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                </div>
                <div>
                  <label className="text-sm">Date</label>
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => setField('date', e.target.value)}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.date ? 'border-red-500' : 'border-gray-300'} pr-10`}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => handleCalendarClick(dateInputRef)}
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="text-sm">Registration Deadline</label>
                  <div className="relative">
                    <input
                      ref={deadlineInputRef}
                      type="datetime-local"
                      value={form.registrationDeadline}
                      onChange={(e) => setField('registrationDeadline', e.target.value)}
                      className={`w-full mt-1 px-3 py-2 border rounded-lg bg-white ${errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'} pr-10`}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => handleCalendarClick(deadlineInputRef)}
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  {errors.registrationDeadline && <p className="text-red-500 text-xs mt-1">{errors.registrationDeadline}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.foodAndBeverageAvailable}
                    onChange={(e) => setField('foodAndBeverageAvailable', e.target.checked)}
                  />
                  <span>Food and beverage available</span>
                </label>
                <textarea
                  value={form.foodAndBeverageDetails}
                  onChange={(e) => setField('foodAndBeverageDetails', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white ${errors.foodAndBeverageDetails ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  placeholder="Details (optional)"
                />
                {errors.foodAndBeverageDetails && <p className="text-red-500 text-xs mt-1">{errors.foodAndBeverageDetails}</p>}
              </div>
              <div className="pt-2">
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
