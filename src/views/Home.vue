<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/50">
    <!-- Hero Section -->
    <div class="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <!-- 背景动画效果 -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div class="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div class="absolute top-0 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="text-center">
          <h1 class="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
            欢迎来到 CodeVerse
          </h1>
          <p class="mt-6 text-xl text-gray-600 animate-fade-in-up">
            开启你的编程学习之旅，让知识的星辰闪耀
          </p>
          <div class="mt-10 flex justify-center space-x-6 animate-fade-in-up animation-delay-300">
            <router-link 
              to="/problems" 
              class="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              开始学习
            </router-link>
            <router-link 
              to="/learn" 
              class="px-8 py-3 rounded-full bg-white text-indigo-600 font-medium border-2 border-indigo-600/30 hover:border-indigo-600 hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              学习路线
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-lg relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feature, index) in features" 
            :key="feature.title"
            class="relative group"
            :class="{'animate-fade-in-up': true}"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <div class="h-full bg-white rounded-2xl shadow-lg p-8 transform group-hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-100 relative overflow-hidden">
              <!-- 特效背景 -->
              <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                :class="feature.gradient"
              ></div>
              
              <div class="relative z-10">
                <div class="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
                  :class="feature.color"
                >
                  <i :class="['text-white text-2xl', feature.icon]"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
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
    </div>

    <!-- Stats Section -->
    <div class="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(stat, index) in stats" 
            :key="stat.title"
            class="text-center transform hover:-translate-y-1 transition-transform duration-300"
            :class="{'animate-fade-in-up': true}"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
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
    color: 'from-blue-500 to-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    title: '实时反馈',
    description: '代码提交后立即获得执行结果和优化建议，快速改进你的解决方案',
    icon: 'fas fa-bolt',
    color: 'from-amber-500 to-orange-500',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    title: '学习路径',
    description: '根据你的水平定制专属的学习计划，循序渐进提升编程技能',
    icon: 'fas fa-road',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-500 to-teal-600'
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
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

@keyframes gradient-x {
  0% { background-size: 200% 100%; background-position: left center; }
  100% { background-size: 200% 100%; background-position: right center; }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-gradient-x {
  animation: gradient-x 3s linear infinite alternate;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 4rem 4rem;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}
</style> 