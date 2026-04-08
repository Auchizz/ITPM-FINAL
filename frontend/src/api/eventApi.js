import axiosInstance from './axios'

export default {
  async getEvents() {
    const res = await axiosInstance.get('/events')
    return res.data
  },

  async getEventById(id) {
    const res = await axiosInstance.get(`/events/${id}`)
    return res.data
  },

  async createEvent(payload) {
    const res = await axiosInstance.post('/events', payload)
    return res.data
  },

  async createEventWithImage(formData) {
    const res = await axiosInstance.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return res.data
  },

  async updateEvent(id, payload) {
    const res = await axiosInstance.put(`/events/${id}`, payload, {
      headers: payload instanceof FormData ? {
        'Content-Type': 'multipart/form-data'
      } : {}
    })
    return res.data
  },

  async deleteEvent(id) {
    const res = await axiosInstance.delete(`/events/${id}`)
    return res.data
  },

  async updateEventStatus(id, status) {
    const res = await axiosInstance.patch(`/events/${id}/status`, { status })
    return res.data
  }
}
