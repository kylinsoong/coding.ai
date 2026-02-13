import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  logout: () => api.post('/api/users/logout'),
  getProfile: () => api.get('/api/users/profile'),
  updateStatus: (data) => api.put('/api/users/status', data),
  getQRCode: () => api.get('/api/users/qrcode'),
}

export const lotteryAPI = {
  participate: () => api.post('/api/lottery/participate'),
  getHistory: (params) => api.get('/api/lottery/history', { params }),
  getAllLotteries: (params) => api.get('/api/lottery/all', { params }),
  getWinners: (params) => api.get('/api/lottery/winners', { params }),
  getLeaderboard: () => api.get('/api/lottery/leaderboard'),
  claimPrize: (lotteryId) => api.put(`/api/lottery/claim/${lotteryId}`),
}

export const redEnvelopeAPI = {
  create: (data) => api.post('/api/redenvelopes', data),
  getAll: (params) => api.get('/api/redenvelopes', { params }),
  getById: (id) => api.get(`/api/redenvelopes/${id}`),
  update: (id, data) => api.put(`/api/redenvelopes/${id}`, data),
  delete: (id) => api.delete(`/api/redenvelopes/${id}`),
  toggle: (id) => api.patch(`/api/redenvelopes/${id}/toggle`),
}

export const activityAPI = {
  create: (data) => api.post('/api/activities', data),
  getAll: (params) => api.get('/api/activities', { params }),
  getById: (id) => api.get(`/api/activities/${id}`),
  update: (id, data) => api.put(`/api/activities/${id}`, data),
  delete: (id) => api.delete(`/api/activities/${id}`),
  updateStatus: (id, data) => api.patch(`/api/activities/${id}/status`, data),
  getActive: () => api.get('/api/activities/active'),
}

export const userAPI = {
  getAll: (params) => api.get('/api/users/users', { params }),
}

export default api
