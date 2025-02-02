/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_CLIENT_ID: string
  readonly VITE_API_URL: string
  readonly VITE_VERCEL_URL: string
  readonly DEV: boolean
  // Add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 