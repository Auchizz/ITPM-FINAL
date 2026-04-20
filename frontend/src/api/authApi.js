import axiosInstance from './axios'

export default {
  async login({ email, password }) {
    const res = await axiosInstance.post('/auth/login', { email, password })
    return res.data
  },
  async register(payload) {
    const res = await axiosInstance.post('/auth/register', payload)
    return res.data
  },
  async profile() {
    // backend exposes /api/auth/me
    const res = await axiosInstance.get('/auth/me')
    return res.data
  }
}
