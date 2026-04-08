import axios from 'axios'

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('uni_token')
=======
  baseURL: 'http://localhost:5004/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
>>>>>>> origin/main
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosInstance
