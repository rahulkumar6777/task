import axios from 'axios'

const API_URL = 'https://apitask.deployhub.online/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  register: (data) => api.post('/v1/auth/register', data),
  login: (data) => api.post('/v1/auth/login', data),
  getMe: () => api.get('/v1/auth/me')
}

export const tasks = {
  getAll: () => api.get('/v1/tasks'),
  getOne: (id) => api.get(`/v1/tasks/${id}`),
  create: (data) => api.post('/v1/tasks', data),
  update: (id, data) => api.put(`/v1/tasks/${id}`, data),
  delete: (id) => api.delete(`/v1/tasks/${id}`)
}

export default api