import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APIGATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  // Log the full URL with query params for debugging
  console.log('[httpClient] Request URL:', config.url)
  console.log('[httpClient] Query Params:', config.params)

  return config
})

// Add response interceptor to log the actual request URL
httpClient.interceptors.response.use(
  (response) => {
    console.log(
      '[httpClient] Response from:',
      response.config.url,
      'with params:',
      response.config.params,
    )
    console.log('[httpClient] Full request URL:', response.request.responseURL)
    return response
  },
  (error) => {
    if (error.config) {
      console.error(
        '[httpClient] Error request URL:',
        error.config.url,
        'with params:',
        error.config.params,
      )
    }
    return Promise.reject(error)
  },
)
