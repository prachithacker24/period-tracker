import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add user_id from localStorage
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.id) {
      // Add user_id to query params if not already present
      config.params = {
        ...config.params,
        user_id: user.id
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404 && error.config.url.includes('/auth/profile')) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  signup: (email, password, name) =>
    api.post('/auth/signup', { email, password, name }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getProfile: (userId) =>
    api.get('/auth/profile', { params: { user_id: userId } }),

  logout: () =>
    api.post('/auth/logout'),
}

// Period APIs
export const periodAPI = {
  getAll: () =>
    api.get('/periods'),

  getById: (id) =>
    api.get(`/periods/${id}`),

  create: (data) =>
    api.post('/periods', data),

  update: (id, data) =>
    api.put(`/periods/${id}`, data),

  delete: (id) =>
    api.delete(`/periods/${id}`),
}

export default api
