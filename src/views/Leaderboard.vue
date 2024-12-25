<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
    <!-- 左侧装饰 -->
    <div class="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 space-y-8">
      <div class="space-y-6 transform -rotate-12">
        <div class="w-16 h-16 bg-indigo-100 rounded-xl shadow-lg flex items-center justify-center animate-float">
          <i class="fas fa-code text-2xl text-indigo-500"></i>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-xl shadow-lg flex items-center justify-center animate-float" style="animation-delay: 1s">
          <i class="fas fa-star text-xl text-purple-500"></i>
        </div>
        <div class="w-14 h-14 bg-pink-100 rounded-xl shadow-lg flex items-center justify-center animate-float" style="animation-delay: 1.5s">
          <i class="fas fa-trophy text-xl text-pink-500"></i>
        </div>
      </div>
    </div>

    <!-- 右侧装饰 -->
    <div class="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 space-y-8">
      <div class="space-y-6 transform rotate-12">
        <div class="w-14 h-14 bg-blue-100 rounded-xl shadow-lg flex items-center justify-center animate-float">
          <i class="fas fa-medal text-xl text-blue-500"></i>
        </div>
        <div class="w-16 h-16 bg-green-100 rounded-xl shadow-lg flex items-center justify-center animate-float" style="animation-delay: 0.5s">
          <i class="fas fa-award text-2xl text-green-500"></i>
        </div>
        <div class="w-12 h-12 bg-yellow-100 rounded-xl shadow-lg flex items-center justify-center animate-float" style="animation-delay: 2s">
          <i class="fas fa-crown text-xl text-yellow-500"></i>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute top-40 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style="animation-delay: 2s"></div>
      <div class="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style="animation-delay: 4s"></div>
    </div>

    <!-- 原有内容 -->
    <div class="container mx-auto px-4 py-12 relative z-10">
      <!-- 标题部分 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          贡献榜
        </h1>
        <p class="text-gray-600">
          感谢每一位为社区贡献题目的开发者
        </p>
      </div>

      <!-- 排行榜列表 -->
      <div class="max-w-3xl mx-auto space-y-4">
        <div v-for="(contributor, index) in contributors" 
          :key="contributor.createUser"
          class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transform hover:-translate-y-1 transition-all duration-300"
          :class="{'animate-fade-in': true}"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- 排名徽章 -->
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <div class="relative">
                <div :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold',
                  index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-50 text-blue-600'
                ]">
                  {{ index + 1 }}
                </div>
                <!-- 奖杯图标 -->
                <div v-if="index < 3" 
                  class="absolute -top-2 -right-2 transform rotate-12 animate-bounce-small"
                >
                  <i :class="[
                    'fas fa-trophy text-lg',
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    'text-orange-500'
                  ]"></i>
                </div>
              </div>
            </div>

            <!-- 用户信息 -->
            <div class="flex-1 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="relative group">
                  <img 
                    :src="contributor.createUserAvatar" 
                    :alt="contributor.createUser"
                    class="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-indigo-300 transition-all duration-300"
                  >
                  <!-- 头像光效 -->
                  <div class="absolute inset-0 rounded-full bg-indigo-400/0 group-hover:bg-indigo-400/10 transition-colors duration-300"></div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ contributor.createUser }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    贡献题目数：
                    <span class="text-indigo-600 font-medium">
                      {{ contributor.subjectCount }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- 贡献指标 -->
              <div class="hidden sm:block">
                <div class="flex items-center space-x-2">
                  <div class="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                      :style="{ width: `${(contributor.subjectCount / maxCount) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">
                    {{ ((contributor.subjectCount / maxCount) * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'

interface Contributor {
  createUser: string
  createUserAvatar: string
  subjectCount: number
}

const contributors: Ref<Contributor[]> = ref([])

// 计算最大贡献数
const maxCount = computed(() => {
  return Math.max(...contributors.value.map((c: Contributor) => c.subjectCount))
})

// 获取排行榜数据
const fetchLeaderboard = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/getContributeList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.success) {
      contributors.value = data.data
    }
  } catch (error) {
    console.error('获取排行榜失败:', error)
  }
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
@keyframes gradient-x {
  0% { background-size: 200% 100%; background-position: left center; }
  100% { background-size: 200% 100%; background-position: right center; }
}

.animate-gradient-x {
  animation: gradient-x 3s linear infinite alternate;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes bounce-small {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-3px) rotate(12deg); }
}

.animate-bounce-small {
  animation: bounce-small 2s infinite;
}

/* 添加渐变背景动画 */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 添加新的动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}
</style> 