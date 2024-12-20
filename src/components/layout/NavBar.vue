<template>
  <nav 
    class="sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300"
    :class="[
      scrolled 
        ? 'bg-white/90 shadow-lg border-transparent' 
        : 'bg-white/80 shadow-sm border-gray-100'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2 group">
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 relative">
              <!-- Logo 光效 -->
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
              <span class="text-white font-bold relative z-10">C</span>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
              CodeVerse
            </span>
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-1">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="[
              $route.path === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
            ]"
          >
            <span class="relative z-10 flex items-center space-x-2">
              <i :class="[
                item.icon, 
                'transition-all duration-300 group-hover:scale-110',
                $route.path === item.path ? 'animate-bounce-small' : ''
              ]"></i>
              <span class="relative">
                {{ item.name }}
                <!-- 添加文字下方的装饰点 -->
                <span 
                  class="absolute -bottom-0.5 left-1/2 w-1 h-1 bg-indigo-400 rounded-full transform -translate-x-1/2 transition-all duration-300 opacity-0 scale-0"
                  :class="{ 'opacity-100 scale-100': $route.path === item.path }"
                ></span>
              </span>
            </span>
            <!-- 动态下划线效果 -->
            <div
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
              :class="{ 'scale-x-100': $route.path === item.path }"
            ></div>
            <!-- 悬浮光效 -->
            <div class="absolute inset-0 rounded-lg bg-indigo-400/0 group-hover:bg-indigo-400/5 transition-colors duration-300"></div>
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative overflow-hidden group"
          >
            <span class="sr-only">打开主菜单</span>
            <!-- 添加按钮动画效果 -->
            <div class="relative z-10">
              <i class="fas fa-bars text-xl transition-all duration-300"
                :class="{ 'opacity-0 rotate-180 scale-0': isMobileMenuOpen }"></i>
              <i class="fas fa-times text-xl absolute inset-0 transition-all duration-300"
                :class="{ 'opacity-100 rotate-0 scale-100': isMobileMenuOpen, 'opacity-0 -rotate-180 scale-0': !isMobileMenuOpen }"></i>
            </div>
            <!-- 按钮点击波纹效果 -->
            <div class="absolute inset-0 bg-indigo-400/10 transform scale-0 group-hover:scale-100 rounded-lg transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-show="isMobileMenuOpen" 
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 relative overflow-hidden group"
            :class="[
              $route.path === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <span class="relative z-10 flex items-center space-x-2">
              <i :class="[item.icon, 'transition-transform group-hover:scale-110 duration-200']"></i>
              <span>{{ item.name }}</span>
            </span>
            <!-- 移动��菜单项悬浮效果 -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:to-purple-400/5 transition-colors duration-300"></div>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'

interface MenuItem {
  name: string
  path: string
  icon: string
}

const isMobileMenuOpen: Ref<boolean> = ref(false)

const menuItems: MenuItem[] = [
  { name: '首页', path: '/', icon: 'fas fa-home' },
  { name: '题库', path: '/problems', icon: 'fas fa-code' },
  { name: '学习', path: '/learn', icon: 'fas fa-book' },
  { name: '排行榜', path: '/leaderboard', icon: 'fas fa-trophy' },
]

// 添加滚动监听
const scrolled: Ref<boolean> = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 添加导航项悬浮动画 */
.router-link-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  border-radius: 8px;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.8);
}

.router-link-active:hover::before {
  opacity: 1;
  transform: scale(1);
}

/* 添加移动菜单动画 */
.md\:hidden {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加毛玻璃效果 */
.backdrop-blur-lg {
  backdrop-filter: blur(8px);
}

/* 添加导航栏滚动阴影效果 */
.sticky {
  transition: box-shadow 0.3s ease;
}

.sticky:not(.shadow-sm) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 添加移动菜单展开/收起动画 */
.md\:hidden > div {
  transform-origin: top;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.md\:hidden[v-show="false"] > div {
  transform: scaleY(0);
  opacity: 0;
}

/* 添加导航项点击波纹效果 */
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.router-link-active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgba(99, 102, 241, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加小弹跳动画 */
@keyframes bounce-small {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-bounce-small {
  animation: bounce-small 2s infinite;
}

/* 添加导航栏滚动渐变效果 */
nav {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

nav.scrolled {
  @apply shadow-lg bg-white/90;
  transform: translateY(-2px);
}
</style>

<script lang="ts">
export default {
  name: 'NavBar'
}
</script> 