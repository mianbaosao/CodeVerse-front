<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          模拟面试
        </h1>
        <p class="text-gray-600">
          在真实场景中练习，提升面试技巧
        </p>
      </div>

      <!-- 面试模式选择 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="mode in interviewModes" 
          :key="mode.title"
          class="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <i :class="[mode.icon, 'text-2xl text-indigo-600']"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ mode.title }}</h3>
              <p class="text-sm text-gray-600">{{ mode.description }}</p>
            </div>
          </div>
          <button class="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            开始练习
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const interviewModes = [
  {
    title: '算法面试',
    description: '模拟真实的算法编程面试场景',
    icon: 'fas fa-code'
  },
  {
    title: '系统设计',
    description: '练习架构设计和系统设计问题',
    icon: 'fas fa-project-diagram'
  },
  {
    title: '行为面试',
    description: '提升沟通技巧和表达能力',
    icon: 'fas fa-comments'
  }
]
</script> 