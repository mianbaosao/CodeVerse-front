<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-circle text-4xl"></i>
        </div>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchScoreDetails"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          重试
        </button>
      </div>

      <!-- 正常内容 -->
      <template v-else>
        <!-- 成绩概览 -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">练习总结</h1>
            
            <!-- 添加练习信息 -->
            <div class="text-gray-600 mb-6">
              <div class="flex justify-center items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-clock"></i>
                  <span>用时：{{ formatTime(timeUse) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <i class="fas fa-calendar"></i>
                  <span>完成时间：{{ formatDateTime(submitTime) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-center items-center space-x-12 mt-8">
              <div class="text-center transform hover:scale-105 transition-transform">
                <div class="text-5xl font-bold text-indigo-600 mb-2 animate-number">{{ score }}分</div>
                <div class="text-gray-600">总分</div>
              </div>
              <div class="text-center transform hover:scale-105 transition-transform">
                <div class="text-5xl font-bold text-green-600 mb-2 animate-number">{{ correctCount }}</div>
                <div class="text-gray-600">正确题数</div>
              </div>
              <div class="text-center transform hover:scale-105 transition-transform">
                <div class="text-5xl font-bold text-red-600 mb-2 animate-number">{{ errorCount }}</div>
                <div class="text-gray-600">错误题数</div>
              </div>
            </div>

            <!-- 添加正确率进度条 -->
            <div class="mt-8 max-w-md mx-auto">
              <div class="text-sm text-gray-600 mb-2">正确率：{{ accuracy }}%</div>
              <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                  :style="{ width: `${accuracy}%` }"
                ></div>
              </div>
            </div>

            <!-- 添加知识点分析 -->
            <div class="mt-8 max-w-2xl mx-auto">
              <h3 class="text-lg font-medium text-gray-900 mb-4">知识点掌握情况</h3>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(stat, label) in knowledgePointStats" 
                  :key="label"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="text-sm text-gray-600 mb-2">{{ label }}</div>
                  <div class="flex items-center space-x-2">
                    <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-indigo-600 transition-all duration-1000"
                        :style="{ width: `${stat.accuracy}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium text-gray-700">
                      {{ stat.accuracy }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 答题详情 -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6">答题详情</h2>
          
          <div class="space-y-6">
            <div v-for="(question, index) in scoreDetails" 
              :key="index"
              class="p-6 rounded-lg transform hover:-translate-y-1 transition-all duration-300"
              :class="question.isCorrect ? 'bg-green-50' : 'bg-red-50'"
            >
              <!-- 题目基本信息 -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <span class="text-lg font-medium">第 {{ index + 1 }} 题</span>
                  <span :class="{
                    'px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1': true,
                    'bg-green-100 text-green-800': question.isCorrect,
                    'bg-red-100 text-red-800': !question.isCorrect
                  }">
                    <i :class="[
                      'fas',
                      question.isCorrect ? 'fa-check' : 'fa-times'
                    ]"></i>
                    <span>{{ question.isCorrect ? '正确' : '错误' }}</span>
                  </span>
                  <!-- 添加标签展示 -->
                  <div class="flex space-x-2">
                    <span v-for="label in question.detail?.labelNames" 
                      :key="label"
                      class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {{ label }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 题目内容 -->
              <div class="mb-4">
                <h3 class="text-gray-800 font-medium mb-2">{{ question.detail?.subjectName }}</h3>
                
                <!-- 选项列表 -->
                <div class="space-y-2 mt-4">
                  <div v-for="option in question.detail?.optionList" 
                    :key="option.optionType"
                    class="flex items-center p-3 rounded-lg transition-all duration-300"
                    :class="{
                      'bg-green-100 border-2 border-green-200': option.isCorrect === 1,
                      'bg-red-100 border-2 border-red-200': question.detail?.respondAnswer.includes(option.optionType) && option.isCorrect === 0,
                      'bg-gray-50 border border-gray-200': !question.detail?.respondAnswer.includes(option.optionType) && option.isCorrect === 0
                    }"
                  >
                    <!-- 选项标记和内容 -->
                    <div class="flex items-center space-x-3 flex-1">
                      <!-- 选项序号 -->
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        :class="{
                          'bg-green-500 text-white': option.isCorrect === 1,
                          'bg-red-500 text-white': question.detail?.respondAnswer.includes(option.optionType),
                          'bg-gray-200 text-gray-600': !question.detail?.respondAnswer.includes(option.optionType) && option.isCorrect === 0
                        }"
                      >
                        {{ String.fromCharCode(64 + option.optionType) }}
                      </div>

                      <!-- 选项内容 -->
                      <span class="text-gray-700">{{ option.optionContent }}</span>
                    </div>
                    
                    <!-- 答案标记 -->
                    <div class="flex items-center space-x-4">
                      <!-- 用户答案标记 -->
                      <div v-if="question.detail?.respondAnswer.includes(option.optionType)"
                        class="flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
                        :class="option.isCorrect === 1 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                      >
                        <i class="fas fa-user"></i>
                        <span>你的选择</span>
                      </div>

                      <!-- 正确答案标记 -->
                      <div v-if="option.isCorrect === 1"
                        class="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                      >
                        <i class="fas fa-check"></i>
                        <span>正确答案</span>
                      </div>
                    </div>
                  </div>

                  <!-- 添加错误提示 -->
                  <div v-if="!question.isCorrect" 
                    class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div class="flex items-center space-x-2 text-red-700 mb-2">
                      <i class="fas fa-exclamation-circle"></i>
                      <span class="font-medium">错误分析</span>
                    </div>
                    <div class="text-red-800 space-y-2">
                      <div class="flex items-center space-x-2">
                        <i class="fas fa-times-circle text-sm"></i>
                        <span>你的答案：{{ formatSelectedOptions(question.detail?.respondAnswer) }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <i class="fas fa-check-circle text-green-600 text-sm"></i>
                        <span>正确答案：{{ formatCorrectOptions(question.detail?.optionList) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 解析部分 -->
                  <div v-if="question.detail?.subjectParse" 
                    class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div class="flex items-center space-x-2 text-blue-700 mb-2">
                      <i class="fas fa-lightbulb"></i>
                      <span class="font-medium">解析：</span>
                    </div>
                    <p class="text-blue-800">{{ question.detail.subjectParse }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-center space-x-4 mt-8">
          <button 
            @click="router.push('/practice')"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <i class="fas fa-list"></i>
            <span>返回列表</span>
          </button>
          <button 
            @click="router.push(`/practice/${route.params.id}`)"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <i class="fas fa-redo"></i>
            <span>重新练习</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Option {
  optionType: number
  optionContent: string
  isCorrect: number
}

interface SubjectDetail {
  correctAnswer: number[]
  respondAnswer: number[]
  optionList: Option[]
  labelNames: string[]
  subjectName: string
}

interface ScoreDetail {
  subjectId: number
  subjectType: number
  isCorrect: number
  detail?: SubjectDetail
}

const scoreDetails = ref<ScoreDetail[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 计算属性
const correctCount = computed(() => scoreDetails.value.filter(q => q.isCorrect === 1).length)
const errorCount = computed(() => scoreDetails.value.length - correctCount.value)
const score = computed(() => Math.round((correctCount.value / scoreDetails.value.length) * 100))
const accuracy = computed(() => ((correctCount.value / scoreDetails.value.length) * 100).toFixed(1))

// 获取题目详情
const fetchSubjectDetail = async (practiceId: number, subjectId: number, subjectType: number) => {
  try {
    const response = await fetch('http://localhost:3013/practice/detail/getSubjectDetail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId,
        subjectId,
        subjectType
      })
    })

    const data = await response.json()
    if (data.success) {
      return data.data
    }
    throw new Error(data.message || '获取题目详情失败')
  } catch (error) {
    console.error('获取题目详情失败:', error)
    return null
  }
}

// 添加新的接口和响应式变量
interface KnowledgePointStat {
  total: number
  correct: number
  accuracy: number
}

interface KnowledgePointStats {
  [key: string]: KnowledgePointStat
}

const timeUse = ref('')
const submitTime = ref('')
const knowledgePointStats = ref<KnowledgePointStats>({})

// 格式化时间的工具函数
const formatTime = (timeStr: string) => {
  const hours = timeStr.slice(0, 2)
  const minutes = timeStr.slice(2, 4)
  const seconds = timeStr.slice(4, 6)
  return `${hours}:${minutes}:${seconds}`
}

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 计算知识点统计
const calculateKnowledgePointStats = () => {
  const stats: KnowledgePointStats = {}
  
  scoreDetails.value.forEach(question => {
    question.detail?.labelNames.forEach(label => {
      if (!stats[label]) {
        stats[label] = { total: 0, correct: 0, accuracy: 0 }
      }
      stats[label].total++
      if (question.isCorrect === 1) {
        stats[label].correct++
      }
    })
  })
  
  // 计算每个知识点的正确率
  Object.values(stats).forEach(stat => {
    stat.accuracy = Number(((stat.correct / stat.total) * 100).toFixed(1))
  })
  
  knowledgePointStats.value = stats
}

// 获取成绩详情
const fetchScoreDetails = async () => {
  try {
    error.value = null
    loading.value = true
    
    // 检查必要参数
    if (!route.query.practiceId) {
      throw new Error('缺少练习ID')
    }

    const response = await fetch('http://localhost:3013/practice/detail/getScoreDetail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId: Number(route.query.practiceId)
      })
    })

    const data = await response.json()
    if (data.success) {
      scoreDetails.value = data.data
      
      // 使用 Promise.all 并行获取所有题��详情
      const detailPromises = scoreDetails.value.map(question => 
        fetchSubjectDetail(
          Number(route.query.practiceId),
          question.subjectId,
          question.subjectType
        )
      )
      
      const details = await Promise.all(detailPromises)
      
      // 更新题目详情
      scoreDetails.value.forEach((question, index) => {
        question.detail = details[index]
      })
    } else {
      throw new Error(data.message || '获取成绩详情失败')
    }

    // 获取练习信息
    const practiceInfo = await fetch('http://localhost:3013/practice/detail/getPracticeInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId: Number(route.query.practiceId)
      })
    })
    
    const practiceData = await practiceInfo.json()
    if (practiceData.success) {
      timeUse.value = practiceData.data.timeUse
      submitTime.value = practiceData.data.submitTime
    }
    
    // 计算知识点统计
    calculateKnowledgePointStats()
  } catch (error) {
    console.error('获取成绩详情失败:', error)
    error.value = (error instanceof Error ? error.message : '请重试')
  } finally {
    loading.value = false
  }
}

// 添加重试次数限制
const retryCount = ref(0)
const MAX_RETRIES = 3

// 添加自动重试逻辑
const retryFetchDetails = async () => {
  if (retryCount.value >= MAX_RETRIES) {
    error.value = '获取数据失败，请刷新页面重试'
    return
  }

  retryCount.value++
  await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value))
  await fetchScoreDetails()
}

onMounted(() => {
  fetchScoreDetails().catch(() => {
    retryFetchDetails()
  })
})

// 添加页面离开时的清理
onUnmounted(() => {
  error.value = null
  loading.value = false
  scoreDetails.value = []
})

// 添加格式化选项的工具函数
const formatSelectedOptions = (selectedOptions: number[] = []) => {
  if (!selectedOptions || selectedOptions.length === 0) {
    return '未作答'
  }
  return selectedOptions
    .sort((a, b) => a - b)  // 按选项序号排序
    .map(opt => String.fromCharCode(64 + opt))
    .join('、')
}

const formatCorrectOptions = (options: any[] = []) => {
  if (!options || options.length === 0) {
    return '暂无答案'
  }
  return options
    .filter(opt => opt.isCorrect === 1)
    .sort((a, b) => a.optionType - b.optionType)  // 按选项序号排序
    .map(opt => String.fromCharCode(64 + opt.optionType))
    .join('、')
}
</script>

<style scoped>
/* 添加数字动画 */
@keyframes number-count {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-number {
  animation: number-count 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加渐变背景动画 */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 2s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 添加加载动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 添加错误图标动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.fa-exclamation-circle {
  animation: shake 0.5s ease-in-out;
}
</style> 