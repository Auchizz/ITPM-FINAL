import axiosInstance from './axios'

export default {
  async getUsers() {
    const res = await axiosInstance.get('/users')
    return res.data?.data || []
  },
  async updateUser(id, payload) {
    const res = await axiosInstance.put(`/users/${id}`, payload)
    return res.data?.data
  },
  async deleteUser(id) {
    const res = await axiosInstance.delete(`/users/${id}`)
    return res.data
  }
}
