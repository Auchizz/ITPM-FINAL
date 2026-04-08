import axiosInstance from './axios'

export default {
  async login(payload)    { const r = await axiosInstance.post('/auth/login',    payload); return r.data },
  async register(payload) { const r = await axiosInstance.post('/auth/register', payload); return r.data },
  async logout()          { const r = await axiosInstance.post('/auth/logout');             return r.data },
  async profile()         { const r = await axiosInstance.get('/auth/me');                  return r.data },
}
