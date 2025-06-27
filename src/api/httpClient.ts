import axios from 'axios'

// if local env, invoke local
const isLocal = import.meta.env.VITE_LOCAL === 'true'


export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_APIGATEWAY_URL,
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
