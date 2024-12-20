import { createPinia } from 'pinia'

declare module 'pinia' {
  export { createPinia }
  export * from 'pinia'
} 