import axiosInstance from './axios'

const normalizeItem = (item) => {
  if (!item) return item
  return {
    ...item,
    id: item._id ?? item.id
  }
}

const normalizeList = (items = []) => items.map(normalizeItem)
const pluckData = (response) => response.data?.data

export default {
  async getCatalog() {
    const res = await axiosInstance.get('/activity/catalog')
    return {
      sports: normalizeList(pluckData(res)?.sports || []),
      clubs: normalizeList(pluckData(res)?.clubs || [])
    }
  },
  async getOverview() {
    const res = await axiosInstance.get('/activity/overview')
    return pluckData(res)
  },
  async getParticipations() {
    const res = await axiosInstance.get('/activity/participations')
    return normalizeList(pluckData(res))
  },
  async createParticipation(payload) {
    const res = await axiosInstance.post('/activity/participations', payload)
    return normalizeItem(pluckData(res))
  },
  async updateParticipationStatus(id, payload) {
    const res = await axiosInstance.put(`/activity/participations/${id}/status`, payload)
    return normalizeItem(pluckData(res))
  },
  async getFeedback() {
    const res = await axiosInstance.get('/activity/feedback')
    return normalizeList(pluckData(res))
  },
  async submitFeedback(payload) {
    const res = await axiosInstance.post('/activity/feedback', payload)
    return normalizeItem(pluckData(res))
  },
  async getNotifications() {
    const res = await axiosInstance.get('/activity/notifications')
    return normalizeList(pluckData(res))
  },
  async markNotificationRead(id) {
    const res = await axiosInstance.patch(`/activity/notifications/${id}/read`)
    return normalizeItem(pluckData(res))
  },
  async markAllNotificationsRead() {
    const res = await axiosInstance.patch('/activity/notifications/read-all')
    return pluckData(res)
  }
}
