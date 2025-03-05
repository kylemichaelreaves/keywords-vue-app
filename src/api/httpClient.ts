import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APIGATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  }
})
