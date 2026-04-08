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
  async getOverview() {
    const res = await axiosInstance.get('/module/overview')
    return pluckData(res)
  },

  async getSports() {
    const res = await axiosInstance.get('/module/sports')
    return normalizeList(pluckData(res))
  },
  async createSport(payload) {
    const res = await axiosInstance.post('/module/sports', payload)
    return normalizeItem(pluckData(res))
  },
  async updateSport(id, payload) {
    const res = await axiosInstance.put(`/module/sports/${id}`, payload)
    return normalizeItem(pluckData(res))
  },
  async deleteSport(id) {
    const res = await axiosInstance.delete(`/module/sports/${id}`)
    return pluckData(res)
  },

  async getClubs() {
    const res = await axiosInstance.get('/module/clubs')
    return normalizeList(pluckData(res))
  },
  async createClub(payload) {
    const res = await axiosInstance.post('/module/clubs', payload)
    return normalizeItem(pluckData(res))
  },
  async updateClub(id, payload) {
    const res = await axiosInstance.put(`/module/clubs/${id}`, payload)
    return normalizeItem(pluckData(res))
  },
  async deleteClub(id) {
    const res = await axiosInstance.delete(`/module/clubs/${id}`)
    return pluckData(res)
  },

  async getMatches() {
    const res = await axiosInstance.get('/module/matches')
    return normalizeList(pluckData(res))
  },
  async createMatch(payload) {
    const res = await axiosInstance.post('/module/matches', payload)
    return normalizeItem(pluckData(res))
  },
  async updateMatch(id, payload) {
    const res = await axiosInstance.put(`/module/matches/${id}`, payload)
    return normalizeItem(pluckData(res))
  },
  async deleteMatch(id) {
    const res = await axiosInstance.delete(`/module/matches/${id}`)
    return pluckData(res)
  },

  async getPlayers() {
    const res = await axiosInstance.get('/module/players')
    return normalizeList(pluckData(res))
  },
  async createPlayer(payload) {
    const res = await axiosInstance.post('/module/players', payload)
    return normalizeItem(pluckData(res))
  },
  async updatePlayer(id, payload) {
    const res = await axiosInstance.put(`/module/players/${id}`, payload)
    return normalizeItem(pluckData(res))
  },
  async deletePlayer(id) {
    const res = await axiosInstance.delete(`/module/players/${id}`)
    return pluckData(res)
  },

  async getFacilities() {
    const res = await axiosInstance.get('/module/facilities')
    return normalizeList(pluckData(res))
  },
  async createFacility(payload) {
    const res = await axiosInstance.post('/module/facilities', payload)
    return normalizeItem(pluckData(res))
  },
  async updateFacility(id, payload) {
    const res = await axiosInstance.put(`/module/facilities/${id}`, payload)
    return normalizeItem(pluckData(res))
  },
  async deleteFacility(id) {
    const res = await axiosInstance.delete(`/module/facilities/${id}`)
    return pluckData(res)
  },

  async submitInquiry(payload) {
    const res = await axiosInstance.post('/module/inquiries', payload)
    return normalizeItem(pluckData(res))
  },

  async getInquiries() {
    const res = await axiosInstance.get('/module/inquiries')
    return normalizeList(pluckData(res))
  }
}
