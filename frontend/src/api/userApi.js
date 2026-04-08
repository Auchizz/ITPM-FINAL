import axiosInstance from './axios'

export default {
  async getUsers() {
    const res = await axiosInstance.get('/users')
    return res.data
  },
  async updateUser(id, payload) {
    const res = await axiosInstance.put(`/users/${id}`, payload)
    return res.data
  },
  async deleteUser(id) {
    const res = await axiosInstance.delete(`/users/${id}`)
    return res.data
  }
}
