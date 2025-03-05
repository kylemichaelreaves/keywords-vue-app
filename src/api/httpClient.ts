import axios from 'axios'
import { useAuthStore } from '@stores/auth.ts'

const authStore = useAuthStore()

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APIGATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.getToken}`
  }
})
