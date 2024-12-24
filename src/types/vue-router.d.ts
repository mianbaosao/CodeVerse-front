declare module 'vue-router' {
  import type { Component } from 'vue'

  export interface RouteLocationRaw {
    path?: string
    name?: string
    query?: Record<string, string>
  }

  export interface RouteLocationNormalized {
    path: string
    params: Record<string, string>
    query: Record<string, string>
  }

  export interface RouteRecordRaw {
    path: string
    name?: string
    component: Component | (() => Promise<Component>)
    children?: RouteRecordRaw[]
  }

  export interface Router {
    push(to: RouteLocationRaw | string): Promise<void>
    replace(to: RouteLocationRaw | string): Promise<void>
    back(): void
    forward(): void
    go(delta: number): void
    install(app: any): void
    beforeEach(guard: NavigationGuard): void
  }

  export interface NavigationGuard {
    (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ): Promise<void> | void
  }

  export type NavigationGuardNext = (to?: string | false | void) => void

  export interface RouterOptions {
    history: RouterHistory
    routes: RouteRecordRaw[]
  }

  export interface RouterHistory {
    push(to: string): Promise<void>
    replace(to: string): Promise<void>
  }

  export function createRouter(options: RouterOptions): Router
  export function createWebHistory(base?: string): RouterHistory
  export function useRouter(): Router
  export function useRoute(): RouteLocationNormalized

  export const RouterView: Component
} 