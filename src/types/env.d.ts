// import.meta.env type support
// https://vitejs.dev/guide/env-and-mode.html
interface ImportMeta {
  env: {
    BASE_URL: string;
    MODE: string;
    DEV: boolean;
    PROD: boolean;
    VITE_APP_BASE_API_URL?: string; // configured by the consumer
  };
}
