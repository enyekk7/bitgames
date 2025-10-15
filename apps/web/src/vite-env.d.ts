/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_STACKS_NETWORK: string
  readonly VITE_GAME_REGISTRY_ADDRESS: string
  readonly VITE_GAME_REGISTRY_NAME: string
  readonly VITE_BIT_TOKEN_ADDRESS: string
  readonly VITE_BIT_TOKEN_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
