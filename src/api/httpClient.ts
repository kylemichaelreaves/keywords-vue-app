import axios from 'axios'
import { getBaseApiUrl, initBaseApiUrl } from '@constants'

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args)
  }
}

const devError = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.error(...args)
  }
}

export const httpClient = axios.create({
  baseURL: getBaseApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// In DEV mode, resolve the base URL (checking if local server is running)
// and update the httpClient before the first real request goes out.
const baseUrlReady: Promise<void> = initBaseApiUrl().then((resolvedUrl) => {
  httpClient.defaults.baseURL = resolvedUrl
})

httpClient.interceptors.request.use(async (config) => {
  // Ensure the base URL has been resolved before any request fires
  await baseUrlReady

  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  devLog('[httpClient] Request URL:', config.url)
  devLog('[httpClient] Query Params:', config.params)

  return config
})

// Add response interceptor to log the actual request URL
httpClient.interceptors.response.use(
  (response) => {
    devLog(
      '[httpClient] Response from:',
      response.config.url,
      'with params:',
      response.config.params,
    )
    devLog('[httpClient] Full request URL:', response.request.responseURL)
    return response
  },
  (error) => {
    if (error.config) {
      devError(
        '[httpClient] Error request URL:',
        error.config.url,
        'with params:',
        error.config.params,
      )
    }
    return Promise.reject(error)
  },
)
