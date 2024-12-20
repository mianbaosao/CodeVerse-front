/// <reference types="vite/client" />
/// <reference types="vue/dist/vue.d.ts" />
/// <reference types="pinia" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  import { DefineComponent } from 'vue'
  const _default: DefineComponent<{}, {}, any>
  export default _default
}

declare module 'pinia' {
  import { createPinia } from 'pinia'
  export { createPinia }
  export * from 'pinia'
} 