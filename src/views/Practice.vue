<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          套卷练习
        </h1>
        <p class="text-gray-600">
          精心设计的专项练习，助你突破技术瓶颈
        </p>
      </div>

      <!-- 套卷列表 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="flex flex-col items-center py-12">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-circle text-4xl"></i>
        </div>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchPracticeList"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          重试
        </button>
      </div>

      <div v-else-if="practiceList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="set in practiceList" 
          :key="set.setId"
          class="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border border-gray-100"
        >
          <!-- 套卷标题和热度 -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {{ set.setName }}
            </h3>
            <div class="flex items-center space-x-1 text-orange-500">
              <i class="fas fa-fire"></i>
              <span class="text-sm">{{ set.setHeat }}</span>
            </div>
          </div>
          
          <!-- 套卷描述 -->
          <div class="mb-6">
            <p class="text-gray-600">{{ set.setDesc }}</p>
          </div>

          <!-- 套卷信息 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex items-center space-x-2 text-gray-600">
              <i class="fas fa-book-open text-indigo-500"></i>
              <span class="text-sm">{{ set.setDesc }}</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600">
              <i class="fas fa-users text-indigo-500"></i>
              <span class="text-sm">{{ set.setHeat }} 人已练习</span>
            </div>
          </div>

          <!-- 添加一个难度指示器 -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <i class="fas fa-signal text-yellow-500"></i>
              <span class="text-sm text-gray-600">难度：中等</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="fas fa-clock text-blue-500"></i>
              <span class="text-sm text-gray-600">预计用时：30分钟</span>
            </div>
          </div>

          <!-- 开始练习按钮 -->
          <button 
            @click="startPractice(set.setId)"
            class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 group"
          >
            <span>开始练习</span>
            <i class="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>

      <!-- 添加空状态展示 -->
      <div v-else class="flex flex-col items-center py-12">
        <div class="text-gray-400 mb-4">
          <i class="fas fa-folder-open text-4xl"></i>
        </div>
        <p class="text-gray-600">暂无套卷内容</p>
      </div>

      <!-- 分页器 -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center space-x-2">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg transition-all duration-300"
          :class="[
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
          ]"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="flex items-center space-x-1">
          <button 
            v-for="page in displayPages"
            :key="page"
            @click="changePage(page)"
            class="w-10 h-10 rounded-lg transition-all duration-300 flex items-center justify-center"
            :class="[
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg transition-all duration-300"
          :class="[
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
          ]"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface PracticeSet {
  setId: number
  setName: string
  setHeat: number
  setDesc: string
}

const practiceList = ref<PracticeSet[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)

// 添加加载和错误状态
const loading = ref(false)
const error = ref<string | null>(null)

// 获取套卷列表
const fetchPracticeList = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('http://localhost:3013/practice/set/getPreSetContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageInfo: {
          pageNo: currentPage.value,
          pageSize: pageSize.value
        }
      })
    })

    const data = await response.json()
    if (data.success) {
      practiceList.value = data.data.result
      totalPages.value = data.data.totalPages
    } else {
      throw new Error(data.message || '获取套卷列表失败')
    }
  } catch (error) {
    console.error('获取套卷列表失败:', error)
    error.value = error instanceof Error ? error.message : '获取套卷列表失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 计算要显示的页码
const displayPages = computed(() => {
  const pages: number[] = []
  const maxDisplayPages = 5
  
  if (totalPages.value <= maxDisplayPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxDisplayPages - 1)
    
    if (end - start < maxDisplayPages - 1) {
      start = Math.max(1, end - maxDisplayPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// 切换页面
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchPracticeList()
  }
}

// 开始练习
const startPractice = async (setId: number) => {
  try {
    // 获取练习题目
    const response = await fetch('http://localhost:3013/practice/set/getSubjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setId: setId
      })
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || '获取题目失败')
    }

    // 跳转到练习页面
    router.push({
      name: 'PracticeDetail',
      params: {
        id: setId.toString()
      }
    })
  } catch (error) {
    console.error('开始练习失败:', error)
    alert('开始练习失败：' + (error instanceof Error ? error.message : '请重试'))
  }
}

onMounted(() => {
  fetchPracticeList()
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

/* 添加卡片悬浮效果 */
.hover\:shadow-xl {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* 添加按钮渐变动画 */
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.3s ease;
}

.hover\:bg-gradient-to-r:hover {
  background-position: right center;
}

/* 添加图标动画 */
.fa-fire {
  animation: flame 1.5s ease-in-out infinite alternate;
}

@keyframes flame {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; }
}

/* 添加卡片点击效果 */
.transform {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transform:active {
  transform: scale(0.98);
}

/* 添加渐入动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.grid > div {
  animation: fadeIn 0.5s ease-out forwards;
}

.grid > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3) { animation-delay: 0.2s; }
</style> 