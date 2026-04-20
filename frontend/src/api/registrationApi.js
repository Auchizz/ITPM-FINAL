import axiosInstance from './axios'

export default {
  async registerStudent(payload) {
    const res = await axiosInstance.post('/registrations', payload)
    return res.data
  },

  async getRegistrationsByEvent(eventId) {
    const res = await axiosInstance.get(`/registrations/event/${eventId}`)
    return res.data
  },

  async getMyRegistrations() {
    const res = await axiosInstance.get('/registrations/student')
    return res.data
  },

  async getRegistrationById(id) {
    const res = await axiosInstance.get(`/registrations/${id}`)
    return res.data
  },

  async cancelRegistration(id) {
    const res = await axiosInstance.patch(`/registrations/${id}/cancel`)
    return res.data
  }
}
