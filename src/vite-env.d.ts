/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIFITNESS_BASE?: string;
  readonly VITE_MIFITNESS_UID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
