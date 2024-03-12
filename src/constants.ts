const API_GATEWAY_URL = import.meta.env.VITE_APIGATEWAY_URL
const LAMBDA_DEV_URL: string = 'http://127.0.0.1:3001'
const ALIASES: string[] = [
    'api',
    'constants',
    'components',
    'main',
    'stores',
    'test',
    'types'
]

export {API_GATEWAY_URL, LAMBDA_DEV_URL, ALIASES}
