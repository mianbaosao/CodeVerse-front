<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          开发者社区
        </h1>
        <p class="text-gray-600">
          分享经验，交流技术，共同成长
        </p>
      </div>

      <!-- 社区功能区 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="section in communitySections" 
          :key="section.title"
          class="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <i :class="[section.icon, 'text-2xl text-indigo-600']"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ section.title }}</h3>
              <p class="text-sm text-gray-600">{{ section.description }}</p>
            </div>
          </div>
          <button class="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            进入讨论
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const communitySections = [
  {
    title: '技术讨论',
    description: '分享技术见解，解答技术难题',
    icon: 'fas fa-comments'
  },
  {
    title: '面试经验',
    description: '分享面试经验和求职建议',
    icon: 'fas fa-briefcase'
  },
  {
    title: '学习资源',
    description: '优质学习资料和教程分享',
    icon: 'fas fa-book'
  }
]
</script> 