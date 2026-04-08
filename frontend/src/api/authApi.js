import axiosInstance from './axios'

export default {
<<<<<<< HEAD
  async login(payload)    { const r = await axiosInstance.post('/auth/login',    payload); return r.data },
  async register(payload) { const r = await axiosInstance.post('/auth/register', payload); return r.data },
  async logout()          { const r = await axiosInstance.post('/auth/logout');             return r.data },
  async profile()         { const r = await axiosInstance.get('/auth/me');                  return r.data },
=======
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
>>>>>>> origin/main
}
