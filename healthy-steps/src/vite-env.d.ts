/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_FORM_ID?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SHOW_DEMO_EVENTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
