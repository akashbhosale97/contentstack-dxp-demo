/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENTSTACK_API_KEY: string;
  readonly VITE_CONTENTSTACK_DELIVERY_TOKEN: string;
  readonly VITE_CONTENTSTACK_ENVIRONMENT: string;
  readonly VITE_PERSONALIZE_PROJECT_UID: string;
  readonly VITE_CONTENTSTACK_MANAGEMENT_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

