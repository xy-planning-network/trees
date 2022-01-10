/// <reference types="vite/client" />

// import.meta.env type support
// https://vitejs.dev/guide/env-and-mode.html
interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
