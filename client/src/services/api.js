import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('complaint_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
API.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('complaint_token')
      localStorage.removeItem('complaint_user')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(err.response?.data?.message || err.message))
  }
)

export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
}

export const complaintAPI = {
  add: (data) => API.post('/complaints', data),
  getAll: (params) => API.get('/complaints', { params }),
  update: (id, data) => API.put(`/complaints/${id}`, data),
  delete: (id) => API.delete(`/complaints/${id}`),
  search: (params) => API.get('/complaints/search', { params }),
  getStats: () => API.get('/complaints/stats')
}

export const aiAPI = {
  analyze: (data) => API.post('/ai/analyze', data)
}

export default API
