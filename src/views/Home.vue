<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
    <!-- Hero Section -->
    <div class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            欢迎来到 CodeVerse
          </h1>
          <p class="mt-6 text-xl text-gray-600 animate-slide-up">
            开启你的编程学习之旅，让知识的星辰闪耀
          </p>
          <div class="mt-8 flex justify-center space-x-4 animate-slide-up-delay">
            <router-link 
              to="/problems" 
              class="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              开始学习
            </router-link>
            <router-link 
              to="/learn" 
              class="px-8 py-3 rounded-full bg-white text-indigo-600 font-medium border-2 border-indigo-600 hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all"
            >
              学习路线
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-60 backdrop-blur-lg">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feature, index) in features" 
            :key="feature.title"
            class="relative group"
            :class="{'animate-slide-up': true}"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <div class="h-full bg-white rounded-2xl shadow-md p-8 transform group-hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div class="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br flex items-center justify-center"
                :class="feature.color">
                <i :class="['text-white text-2xl', feature.icon]"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" 
            :key="stat.title"
            class="text-center"
          >
            <div class="text-3xl font-bold text-indigo-600 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-600">
              {{ stat.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: '丰富的题库',
    description: '包含各种难度和类型的编程题目，帮助你全面提升编程能力',
    icon: 'fas fa-code',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: '实时反馈',
    description: '代码提交后立即获得执行结果和优化建议，快速改进你的解决方案',
    icon: 'fas fa-bolt',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: '学习路径',
    description: '根据你的水平定制专属的学习计划，循序渐进提升编程技能',
    icon: 'fas fa-road',
    color: 'from-green-500 to-emerald-600'
  }
]

const stats = [
  { title: '注册用户', value: '1000+' },
  { title: '题目数量', value: '500+' },
  { title: '解题次数', value: '10000+' },
  { title: '日活用户', value: '200+' }
]
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-slide-up-delay {
  animation: slide-up 0.6s ease-out 0.3s forwards;
  opacity: 0;
}

/* 添加鼠标悬停时的光晕效果 */
.group:hover::after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  border-radius: 16px;
  z-index: -1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 