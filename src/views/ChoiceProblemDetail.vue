<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <button 
        @click="goBack"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center group"
      >
        <i class="fas fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
        <span>返回题目列表</span>
      </button>

      <!-- 题目卡片 -->
      <div class="bg-white rounded-lg shadow-xl border border-gray-200">
        <!-- 题目头部 -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-xl font-bold text-gray-900">{{ problem.subjectName }}</h1>
            <div class="flex items-center space-x-4">
              <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                {{ problem.subjectDifficult === 1 ? '中等' : '困难' }}
              </span>
              <span class="text-gray-500">
                {{ problem.subjectScore }} 分
              </span>
            </div>
          </div>
          <!-- 标签展示 -->
          <div class="flex items-center space-x-2">
            <span v-for="tag in problem.labelName" 
              :key="tag"
              class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 选项列表 -->
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="(option, index) in problem.optionList" 
              :key="index"
              class="flex items-center space-x-4 hover:shadow-sm transition-all duration-300 rounded-xl"
            >
              <!-- 选项圆圈 -->
              <div
                @click="selectOption(index)"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer select-none flex-shrink-0',
                  hasSubmitted
                    ? option.isCorrect === 1
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : selectedOption === index
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 bg-gray-50 text-gray-500'
                    : selectedOption === index
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-400 text-gray-600'
                ]"
              >
                <span class="text-base font-medium">{{ String.fromCharCode(65 + index) }}</span>
                
                <!-- 正确/错误图标 -->
                <div 
                  v-if="hasSubmitted" 
                  class="absolute -right-1.5 -top-1.5 rounded-full bg-white shadow-sm"
                >
                  <i v-if="option.isCorrect === 1" 
                    class="fas fa-check-circle text-green-500 text-lg"
                  ></i>
                  <i v-if="option.isCorrect === 0 && selectedOption === index"
                    class="fas fa-times-circle text-red-500 text-lg"
                  ></i>
                </div>
              </div>

              <!-- 选项内容 -->
              <div 
                class="flex-1 p-5 rounded-xl transition-all duration-300 min-h-[3rem] flex items-center"
                :class="[
                  hasSubmitted
                    ? option.isCorrect === 1
                      ? 'bg-green-50 text-green-800 border-2 border-green-200'
                      : selectedOption === index
                        ? 'bg-red-50 text-red-800 border-2 border-red-200'
                        : 'bg-gray-50 text-gray-500 border-2 border-gray-100'
                    : selectedOption === index
                      ? 'bg-blue-50 text-blue-800 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-100'
                ]"
              >
                <span class="text-base">{{ option.optionContent }}</span>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="mt-8 flex justify-end">
            <button
              v-if="!hasSubmitted"
              @click="submitAnswer"
              :disabled="selectedOption === null"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            >
              提交答案
            </button>
            <button
              v-else
              @click="goBack"
              class="px-6 py-2 bg-gray-500 text-white rounded-lg transition-all duration-300 hover:bg-gray-600"
            >
              返回列表
            </button>
          </div>

          <!-- 解析 -->
          <div v-if="hasSubmitted && problem.subjectParse" 
            class="mt-6 p-4 bg-blue-50 rounded-lg"
          >
            <h3 class="text-lg font-medium text-blue-900 mb-2">题目解析：</h3>
            <p class="text-blue-800">{{ problem.subjectParse }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Option {
  optionType: number
  optionContent: string
  isCorrect: number
}

interface Problem {
  id: number
  subjectName: string
  subjectDifficult: number
  subjectType: number
  subjectScore: number
  subjectParse: string
  optionList: Option[]
  labelName: string[]
}

const problem = ref<Problem>({
  id: 0,
  subjectName: '',
  subjectDifficult: 1,
  subjectType: 1,
  subjectScore: 0,
  subjectParse: '',
  optionList: [],
  labelName: []
})

const selectedOption = ref<number | null>(null)
const hasSubmitted = ref(false)

// 获取题目详情
const fetchProblemDetail = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/querySubjectInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Number(route.params.id)
      })
    })
    const data = await response.json()
    if (data.success) {
      problem.value = data.data
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
  }
}

const selectOption = (index: number) => {
  if (!hasSubmitted.value) {
    selectedOption.value = index
  }
}

const submitAnswer = () => {
  if (selectedOption.value !== null) {
    hasSubmitted.value = true
  }
}

const goBack = () => {
  // 从 sessionStorage 获取之前保存的状态
  const savedState = sessionStorage.getItem('problemListState')
  if (savedState) {
    const state = JSON.parse(savedState)
    router.push({
      path: '/problems',
      query: {
        type: state.type,
        categoryId: state.categoryId,
        labelId: state.labelId,
        page: state.page
      }
    })
  } else {
    router.push('/problems')
  }
}

onMounted(() => {
  fetchProblemDetail()
})
</script>

<style scoped>
/* 添加选项圆圈的悬浮动画 */
.rounded-full {
  position: relative;
  transform: translateY(0);
}

.rounded-full:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* 添加选中状态的缩放动画 */
@keyframes select-scale {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.border-blue-500 {
  animation: select-scale 0.3s ease-out;
}

/* 添加正确/错误图标的动画 */
@keyframes icon-pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.fa-check-circle,
.fa-times-circle {
  animation: icon-pop 0.3s ease-out;
}
</style> 