/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIFITNESS_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
