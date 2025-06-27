import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APIGATEWAY_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})
