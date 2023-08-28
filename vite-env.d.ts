/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APIGATEWAY_URL: string
    readonly VITE_AWS_ACCESS_KEY_ID: string
    readonly VITE_AWS_SECRET_ACCESS_KEY: string
    readonly VITE_S3_BUCKET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

export { ImportMeta }
