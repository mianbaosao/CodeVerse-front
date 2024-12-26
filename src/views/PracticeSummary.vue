<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 成绩概览 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ title }}</h1>
          <div class="text-gray-600 mb-8">练习完成时间：{{ submitTime }}</div>
          
          <div class="flex justify-center items-center space-x-12">
            <div class="text-center">
              <div class="text-5xl font-bold text-indigo-600 mb-2">{{ score }}分</div>
              <div class="text-gray-600">总分</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-bold text-green-600 mb-2">{{ correctCount }}</div>
              <div class="text-gray-600">正确题数</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-bold text-blue-600 mb-2">{{ timeUsed }}</div>
              <div class="text-gray-600">用时</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 答题详情 -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">答题详情</h2>
        
        <div class="space-y-8">
          <div v-for="(question, index) in questions" :key="index" 
            class="border-b border-gray-200 pb-6 last:border-0"
          >
            <!-- 题目信息 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span class="text-lg font-medium">第 {{ index + 1 }} 题</span>
                <span :class="{
                  'px-2 py-1 rounded-full text-sm': true,
                  'bg-green-100 text-green-800': question.isCorrect,
                  'bg-red-100 text-red-800': !question.isCorrect
                }">
                  {{ question.isCorrect ? '正确' : '错误' }}
                </span>
              </div>
            </div>

            <!-- 题目内容 -->
            <div class="mb-4">
              <h3 class="text-gray-900 mb-4">{{ question.subjectName }}</h3>
              
              <!-- 选项列表 -->
              <div class="space-y-3">
                <div v-for="option in question.optionList" :key="option.optionType"
                  class="flex items-center space-x-3 p-3 rounded-lg"
                  :class="{
                    'bg-green-50 border-2 border-green-200': option.isCorrect,
                    'bg-red-50 border-2 border-red-200': !option.isCorrect && option.optionType === question.userAnswer,
                    'bg-gray-50 border-2 border-gray-200': !option.isCorrect && option.optionType !== question.userAnswer
                  }"
                >
                  <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                    :class="{
                      'bg-green-500 text-white': option.isCorrect,
                      'bg-red-500 text-white': !option.isCorrect && option.optionType === question.userAnswer,
                      'bg-gray-200 text-gray-600': !option.isCorrect && option.optionType !== question.userAnswer
                    }"
                  >
                    {{ String.fromCharCode(64 + option.optionType) }}
                  </span>
                  <span>{{ option.optionContent }}</span>
                </div>
              </div>
            </div>

            <!-- 解析 -->
            <div class="mt-4 bg-blue-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 text-blue-800 mb-2">
                <i class="fas fa-lightbulb"></i>
                <span class="font-medium">题目解析：</span>
              </div>
              <p class="text-blue-900">{{ question.subjectParse }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-center space-x-4 mt-8">
        <button 
          @click="router.push('/practice')"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回列表
        </button>
        <button 
          @click="router.push(`/practice/${route.params.id}`)"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          重新练习
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const title = ref('')
const score = ref(0)
const correctCount = ref(0)
const timeUsed = ref('')
const submitTime = ref('')
const questions = ref([])

// 修改类型定义
interface ScoreDetail {
  subjectId: number
  subjectType: number
  isCorrect: number
}

interface Question extends ScoreDetail {
  subjectName: string
  optionList: Array<{
    optionType: number
    optionContent: string
    isCorrect: number
  }>
  subjectParse: string
  userAnswer: number
}

// 添加格式化时间的工具函数
const formatTimeUsed = (timeStr: string) => {
  const hours = parseInt(timeStr.slice(0, 2))
  const minutes = parseInt(timeStr.slice(2, 4))
  const seconds = parseInt(timeStr.slice(4, 6))
  
  const parts = []
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}秒`)
  
  return parts.join('')
}

// 修改获取练习总结数据的函数
const fetchSummary = async () => {
  try {
    // 获取得分详情
    const scoreResponse = await fetch('http://localhost:3013/practice/detail/getScoreDetail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId: Number(route.query.practiceId)
      })
    })

    const scoreData = await scoreResponse.json()
    if (!scoreData.success) {
      throw new Error(scoreData.message || '获取得分详情失败')
    }

    // 计算正确题数和分数
    const scoreDetails = scoreData.data as ScoreDetail[]
    correctCount.value = scoreDetails.filter(q => q.isCorrect === 1).length
    score.value = Math.round((correctCount.value / scoreDetails.length) * 100)

    // 获取每道题的详细信息
    const detailedQuestions = await Promise.all(
      scoreDetails.map(async (score) => {
        try {
          const detailResponse = await fetch('http://localhost:3013/practice/set/getSubject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subjectId: score.subjectId,
              subjectType: score.subjectType
            })
          })
          
          const detailData = await detailResponse.json()
          if (detailData.success) {
            return {
              ...score,
              ...detailData.data
            }
          }
          throw new Error(detailData.message || '获取题目详情失败')
        } catch (error) {
          console.error(`获取题目 ${score.subjectId} 详情失败:`, error)
          // 返回基本信息，防止整个列表加载失败
          return {
            ...score,
            subjectName: '加载失败',
            optionList: [],
            subjectParse: '题目详情加载失败'
          }
        }
      })
    )

    questions.value = detailedQuestions
  } catch (error) {
    console.error('获取总结数据失败:', error)
    alert('获取练习总结失败：' + (error instanceof Error ? error.message : '请稍后重试'))
  }
}

// 添加错题统计
const errorCount = computed(() => questions.value.length - correctCount.value)
const accuracy = computed(() => ((correctCount.value / questions.value.length) * 100).toFixed(1))

// 添加动画效果
const showStats = ref(false)
onMounted(() => {
  fetchSummary()
  // 添加延迟以显示动画效果
  setTimeout(() => {
    showStats.value = true
  }, 500)
})
</script> 