import axiosInstance from './axios'

export default {
  async getNews(limit = 10)          { try { const r = await axiosInstance.get(`/news?limit=${limit}`);          return r.data?.data || [] } catch { return [] } },
  async getEvents(limit = 6)         { try { const r = await axiosInstance.get(`/events?limit=${limit}`);        return r.data?.data || [] } catch { return [] } },
  async getAnnouncements(limit = 10) { try { const r = await axiosInstance.get(`/announcements?limit=${limit}`); return r.data?.data || [] } catch { return [] } },
  async getGallery(limit = 10)       { try { const r = await axiosInstance.get(`/gallery?limit=${limit}`);       return r.data?.data || [] } catch { return [] } },
  async getStats()                   { try { const r = await axiosInstance.get('/stats');                        return r.data?.data || {} } catch { return {} } },
  async submitRegistration(payload)  { const r = await axiosInstance.post('/registrations', payload); return r.data },
}