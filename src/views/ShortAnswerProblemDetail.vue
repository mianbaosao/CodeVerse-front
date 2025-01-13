<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 添加返回按钮 -->
      <button 
        @click="goBack"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center group"
      >
        <i class="fas fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
        返回题目列表
      </button>

      <div class="bg-white rounded-lg shadow">
        <!-- 题目头部 -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ problem.subjectName }}
            </h1>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              {{ problem.subjectDifficult === 1 ? '中等' : '困难' }}
            </span>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <div class="flex items-center space-x-2">
              <span v-for="tag in problem.labelName" 
                :key="tag"
                class="px-2 py-1 bg-gray-100 rounded-full text-xs"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- 题目内容 -->
        <div class="p-6">
          <div class="mb-8">
            <textarea
              v-model="answer"
              class="w-full h-48 p-4 border rounded-lg font-mono text-sm resize-none"
              placeholder="请在这里输入你的答案..."
              @input="handleInput"
            ></textarea>
          </div>

          <!-- 参考答案区域 -->
          <div v-if="showReference" class="bg-yellow-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">参考答案：</h3>
            <div class="prose max-w-none text-gray-700" v-html="problem.subjectAnswer"></div>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            @click="showReference = !showReference"
            class="text-blue-600 hover:text-blue-700"
          >
            {{ showReference ? '隐藏参考答案' : '查看参考答案' }}
          </button>
          <button
            @click="submitAnswer"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            提交答案
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface Problem {
  id: number
  subjectName: string
  subjectDifficult: number
  subjectType: number
  subjectScore: number
  subjectParse: string
  subjectAnswer: string
  labelName: string[]
}

const problem = ref<Problem>({
  id: 0,
  subjectName: '',
  subjectDifficult: 1,
  subjectType: 4,
  subjectScore: 0,
  subjectParse: '',
  subjectAnswer: '',
  labelName: []
})

const answer: Ref<string> = ref('')
const showReference: Ref<boolean> = ref(false)

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
      // 处理换行符
      if (problem.value.subjectAnswer) {
        problem.value.subjectAnswer = problem.value.subjectAnswer.replace(/\\n/g, '\n')
      }
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  answer.value = target.value
}

const submitAnswer = () => {
  // 提交答案的逻辑
  console.log('提交答案:', answer.value)
}

// 修改返回函数
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
.prose {
  @apply text-gray-800;
}

.prose p {
  @apply mb-4;
}

/* 添加一些基本的 HTML 内容样式 */
/* 修改 :deep 选择器的使用方式 */
:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  @apply font-bold mb-4;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply pl-6 mb-4;
}

:deep(.prose ul) {
  @apply list-disc;
}

:deep(.prose ol) {
  @apply list-decimal;
}

:deep(.prose pre),
:deep(.prose code) {
  @apply bg-gray-100 rounded p-2 font-mono text-sm;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic;
}
</style> 