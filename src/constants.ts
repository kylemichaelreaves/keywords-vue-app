const LAMBDA_DEV_URL: string = 'http://127.0.0.1:3000'
const API_GATEWAY_URL = import.meta.env.VITE_APIGATEWAY_URL
const LOCAL_URL: string = 'http://localhost:5173'

// Use LAMBDA_DEV_URL in development mode, otherwise use API_GATEWAY_URL
const BASE_API_URL = import.meta.env.DEV ? LAMBDA_DEV_URL : API_GATEWAY_URL

export { API_GATEWAY_URL, LAMBDA_DEV_URL, LOCAL_URL, BASE_API_URL }

export { ROUTE_ALIASES } from '../constants.node'