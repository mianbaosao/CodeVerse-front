<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 顶部标题和计时器 -->
      <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm backdrop-blur-lg border border-gray-100">
        <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {{ title }}
        </h1>
        <div class="flex items-center space-x-4">
          <!-- 计时器 -->
          <div class="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
            <button @click="toggleTimer" class="text-gray-500 hover:text-gray-700">
              <i class="fas" :class="timerPaused ? 'fa-play' : 'fa-pause'"></i>
            </button>
            <div class="text-2xl font-mono text-gray-700 tabular-nums">
              {{ formatTime(timer) }}
            </div>
          </div>
          <!-- 进度指示器 -->
          <div class="text-sm text-gray-600">
            进度: {{ currentIndex + 1 }}/{{ subjects.length }}
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex space-x-6">
        <!-- 左侧题目列表导航 -->
        <div class="w-64 bg-white rounded-xl shadow-sm p-4 h-[calc(100vh-12rem)] sticky top-24">
          <h3 class="text-lg font-medium text-gray-800 mb-4">题目导航</h3>
          <div class="space-y-2 overflow-y-auto max-h-[calc(100%-2rem)]">
            <button
              v-for="(subject, index) in subjects"
              :key="subject.subjectId"
              @click="jumpToQuestion(index)"
              class="w-full p-3 rounded-lg text-left transition-all relative group"
              :class="[
                currentIndex === index 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'hover:bg-gray-50 text-gray-600',
                markedQuestions.has(index) ? 'border-l-4 border-yellow-400' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <span>第 {{ index + 1 }} 题</span>
                <div class="flex items-center space-x-2">
                  <i v-if="answers.some(a => a.subjectId === subject.subjectId)" 
                    class="fas fa-check text-green-500"></i>
                  <button 
                    @click.stop="toggleMark(index)"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i class="fas fa-bookmark" 
                      :class="markedQuestions.has(index) ? 'text-yellow-400' : 'text-gray-400'"></i>
                  </button>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- 中间题目内容 -->
        <div class="flex-1">
          <!-- 题目卡片 -->
          <div class="bg-white rounded-xl shadow-sm p-8">
            <!-- 题目类型和难度 -->
            <div class="flex items-center space-x-4 mb-6">
              <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {{ getSubjectTypeLabel(currentSubject?.subjectType) }}
              </span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm',
                getDifficultyClass(currentSubject?.subjectDifficult)
              ]">
                {{ getDifficultyLabel(currentSubject?.subjectDifficult) }}
              </span>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-star mr-2"></i>
                <span>{{ currentSubject?.subjectScore || 0 }}分</span>
              </div>
            </div>

            <!-- 题目内容 -->
            <div v-if="currentSubject" class="space-y-6">
              <!-- 题目标题和描述 -->
              <div>
                <h3 class="text-xl font-medium text-gray-900 mb-4">
                  {{ currentSubject.subjectName }}
                </h3>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="label in currentSubject.labelName" 
                    :key="label"
                    class="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                  >
                    {{ label }}
                  </span>
                </div>
              </div>

              <!-- 选择题选项 -->
              <div v-if="[1, 2].includes(currentSubject.subjectType)" class="space-y-4">
                <div 
                  v-for="option in currentSubject.optionList" 
                  :key="option.optionType"
                  class="relative"
                >
                  <label 
                    class="flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300"
                    :class="[
                      isOptionSelected(option.optionType)
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    ]"
                  >
                    <input
                      :type="currentSubject.subjectType === 1 ? 'radio' : 'checkbox'"
                      :name="'option'"
                      :value="option.optionType"
                      v-model="selectedOption"
                      class="hidden"
                      @change="handleOptionSelect(option.optionType)"
                    >
                    <div class="flex items-center space-x-3 flex-1">
                      <div 
                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        :class="[
                          isOptionSelected(option.optionType)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        ]"
                      >
                        {{ String.fromCharCode(64 + option.optionType) }}
                      </div>
                      <span class="text-gray-700">{{ option.optionContent }}</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 判断题选项 -->
              <div v-else-if="currentSubject.subjectType === 3" class="space-y-4">
                <div class="flex space-x-4">
                  <label 
                    v-for="option in [
                      { value: 1, label: '正确' },
                      { value: 2, label: '错误' }
                    ]"
                    :key="option.value"
                    class="flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300"
                    :class="[
                      isOptionSelected(option.value)
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    ]"
                  >
                    <input
                      type="radio"
                      :name="'judge'"
                      :value="option.value"
                      v-model="selectedOption"
                      class="hidden"
                      @change="handleOptionSelect(option.value)"
                    >
                    <div class="text-center">{{ option.label }}</div>
                  </label>
                </div>
              </div>

              <!-- 简答题输入框 -->
              <div v-else-if="currentSubject.subjectType === 4" class="space-y-4">
                <textarea
                  v-model="answerContent"
                  rows="6"
                  class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="请输入你的答案..."
                  @input="handleAnswerInput"
                ></textarea>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-else-if="loading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
            </div>

            <!-- 错误状态 -->
            <div v-else class="text-center py-12 text-gray-500">
              暂无题目内容
            </div>
          </div>
        </div>

        <!-- 右侧工具栏 -->
        <div class="w-64 space-y-4">
          <!-- 答题卡 -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-4">答题进度</h3>
            <div class="grid grid-cols-5 gap-2">
              <div
                v-for="(subject, index) in subjects"
                :key="subject.subjectId"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all"
                :class="[
                  getQuestionStatusClass(subject.subjectId),
                  currentIndex === index ? 'ring-2 ring-indigo-500' : ''
                ]"
                @click="jumpToQuestion(index)"
              >
                {{ index + 1 }}
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-4">快捷操作</h3>
            <div class="space-y-2">
              <button
                @click="toggleMark(currentIndex)"
                class="w-full p-2 rounded-lg text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <i class="fas fa-bookmark text-yellow-400"></i>
                <span>标记当前题目</span>
              </button>
              <button
                @click="submitPractice"
                class="w-full p-2 rounded-lg text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <i class="fas fa-paper-plane text-indigo-500"></i>
                <span>提交试卷</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加确认弹窗 -->
  <div v-if="showSubmitConfirm" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-fade-in">
      <!-- 弹窗标题 -->
      <div class="text-center mb-6">

        <h3 class="text-xl font-bold text-gray-900">提交前确认</h3>
      </div>

      <!-- 提示内容 -->
      <div class="text-center mb-8">
        <p class="text-gray-600">
          你还有部分题目未完成，交卷即可查看试卷全部答案及解析，是否立即交卷？
        </p>
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-center space-x-4">
        <button 
          @click="showSubmitConfirm = false"
          class="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          继续做题
        </button>
        <button 
          @click="confirmSubmit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          立即交卷
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

// 类型定义
interface Subject {
  id: number
  subjectId: string
  subjectName: string
  subjectType: number
  subjectDesc: string
  subjectDifficult: number
  subjectScore: number
  optionList?: Option[]
  labelName?: string[]
}

interface Option {
  optionType: number
  optionContent: string
  isCorrect: number
}

interface Answer {
  subjectId: string
  answer: number[]
  isSubmitted: boolean
}

interface SubmitResponse {
  success: boolean
  message?: string
  data?: any
}

interface PracticeResponse {
  title: string
  subjectList: {
    subjectId: number  // 修改为 number 类型
    subjectType: number
  }[]
  practiceId: number
}

interface SubmitData {
  practiceId: string | number
  subjectId: string
  answerContents: (string | number)[]
  subjectType: number
  timeUse: string
}

// 状态定义
const route: RouteLocationNormalizedLoaded = useRoute()
const router = useRouter()

const title = ref<string>('')
const subjects = ref<Subject[]>([])
const currentIndex = ref<number>(0)
const currentSubject = ref<Subject | null>(null)
const selectedOption = ref<number[]>([])
const answers = ref<Answer[]>([])
const loading = ref<boolean>(false)
const timer = ref<number>(0)
const timerPaused = ref<boolean>(false)
let timerInterval: ReturnType<typeof setInterval> | null = null
const autoSaveTimer = ref<ReturnType<typeof setInterval> | null>(null)
const practiceId = ref<string | number>(route.params.id)
const isSubmitted = ref<boolean>(false)
const markedQuestions = ref<Set<number>>(new Set())
const showSubmitConfirm = ref<boolean>(false)
const answerContent = ref('')

// 添加本地存储的键名常量
const STORAGE_KEY = 'practice_answers'

// 添加加载已保存答案的函数
const loadSavedAnswers = () => {
  const savedAnswers = localStorage.getItem(STORAGE_KEY)
  if (savedAnswers) {
    try {
      const parsed = JSON.parse(savedAnswers)
      // 只加载当前练习的答案
      const practiceAnswers = parsed[practiceId.value] || []
      answers.value = practiceAnswers
    } catch (error) {
      console.error('加载已保存答案失败:', error)
    }
  }
}

// 添加保存答案到本地存储的函数
const saveAnswersToStorage = () => {
  try {
    const savedAnswers = localStorage.getItem(STORAGE_KEY)
    const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : {}
    
    // 更新当前练习的答案
    allAnswers[practiceId.value] = answers.value
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAnswers))
  } catch (error) {
    console.error('保存答案失败:', error)
  }
}

// 工具函数
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatTimeForSubmit = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return [hours, minutes, secs]
    .map(num => num.toString().padStart(2, '0'))
    .join('')
}

const formatSubmitTime = (): string => {
  const now = new Date()
  return now.toISOString().slice(0, 19).replace('T', ' ')
}

const getSubjectTypeLabel = (type?: number): string => {
  const types: Record<number, string> = {
    1: '单选题',
    2: '多选题',
    3: '判断题',
    4: '简答题'
  }
  return types[type || 0] || '未知类型'
}

const getDifficultyLabel = (difficult?: number): string => {
  return ['', '中等', '困难'][difficult || 0] || '未知'
}

const getDifficultyClass = (difficult?: number): string => {
  const classes = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-red-100 text-red-800'
  }
  return classes[difficult as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// 获取套题目列表
const fetchPracticeSubjects = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:3013/practice/set/getSubjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setId: Number(route.params.id)
      })
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || '获取题目失败')
    }

    const practiceData = data.data as PracticeResponse
    subjects.value = practiceData.subjectList
    practiceId.value = practiceData.practiceId
    title.value = practiceData.title

    if (subjects.value.length > 0) {
      await fetchCurrentSubject()
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
    alert('获取题目失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
  }
}

// 获取当前题目详情
const fetchCurrentSubject = async () => {
  if (!subjects.value?.[currentIndex.value]) return

  try {
    loading.value = true
    const subject = subjects.value[currentIndex.value]
    
    const response = await fetch('http://localhost:3010/subject/querySubjectInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: subject.subjectId
      })
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || '获取题目失败')
    }

    // 更新当前题目对象
    currentSubject.value = data.data
    
    // 加载已保存的答案
    const savedAnswer = answers.value.find(a => a.subjectId === subject.subjectId)
    if (savedAnswer && Array.isArray(savedAnswer.answer)) {
      selectedOption.value = savedAnswer.answer
    } else {
      selectedOption.value = [] // 确保重置为空数组
    }

  } catch (error) {
    console.error('获取题目详情失败:', error)
    showError('获取题目失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
  }
}

// 修改跳转到指定题目的函数
const jumpToQuestion = async (index: number): Promise<void> => {
  if (!subjects.value || index >= subjects.value.length) return
  
  currentIndex.value = index
  await fetchCurrentSubject() // 获取题目时会自动加载已保存的答案
}

// 修改获取题目状态样式的函数
const getQuestionStatusClass = (subjectId: string | number) => {
  const answer = answers.value.find(a => a.subjectId === subjectId)
  if (answer) {
    if (answer.isSubmitted) {
      return 'bg-blue-500 text-white' // 已提交的改为蓝色
    }
    return 'bg-yellow-500 text-white' // 已作答但未提交
  }
  return 'bg-gray-100 text-gray-600 hover:bg-gray-200' // 未作答
}

// 修改选项选择的处理函数
const handleOptionSelect = async (optionType: number) => {
  if (!currentSubject.value) return
  
  // 更新当前题目的选项
  if (currentSubject.value.subjectType === 2) {
    // 多选题处理
    const newSelectedOptions = [...selectedOption.value]
    const index = newSelectedOptions.indexOf(optionType)
    if (index === -1) {
      newSelectedOptions.push(optionType)
    } else {
      newSelectedOptions.splice(index, 1)
    }
    selectedOption.value = newSelectedOptions.sort((a, b) => a - b)
  } else {
    // 单选题和判断题处理
    selectedOption.value = [optionType]
  }

  // 更新本地暂存
  const answerIndex = answers.value.findIndex(a => a.subjectId === currentSubject.value.subjectId)
  const answer: Answer = {
    subjectId: currentSubject.value.subjectId,
    answer: selectedOption.value,
    isSubmitted: false
  }

  if (answerIndex === -1) {
    answers.value.push(answer)
  } else {
    answers.value[answerIndex] = answer
  }

  // 保存到本地存储
  localStorage.setItem('practiceAnswers', JSON.stringify(answers.value))

  // 选择后立即提交答案
  await submitSingleAnswer()
}

// 上一题
const prevQuestion = async () => {
  if (currentIndex.value > 0) {
    // 切换题目前重置选项状态
    selectedOption.value = []
    answerContent.value = ''
    
    currentIndex.value--
    await fetchCurrentSubject()
  }
}

// 修改下一题函数
const nextQuestion = async () => {
  if (!subjects.value?.length || selectedOption.value.length === 0) return
  
  if (currentIndex.value < subjects.value.length - 1) {
    try {
      loading.value = true
      const currentSubject = subjects.value[currentIndex.value]
      
      // 先提交当前题目的答案
      const response = await fetch('http://localhost:3013/practice/detail/submitSubject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceId: practiceId.value,
          subjectId: currentSubject.subjectId,
          answerContents: selectedOption.value,
          subjectType: currentSubject.subjectType,
          timeUse: formatTimeForSubmit(timer.value)
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || '提交答案失败')
      }

      // 切换题目前重置选项状态
      selectedOption.value = []
      answerContent.value = ''

      // 提交成功后再进入下一题
      currentIndex.value++
      await fetchCurrentSubject()
    } catch (error) {
      console.error('提交答案失败:', error)
      alert('提交答案失败，请重试')
    } finally {
      loading.value = false
    }
  }
}

// 修改提交练习的函数
const submitPractice = () => {
  if (!subjects.value?.length) {
    alert('题目加载失败，请刷新页面重试')
    return
  }

  // 显示确认弹窗
  showSubmitConfirm.value = true
}

// 添加确认提交的函数
const confirmSubmit = async () => {
  try {
    loading.value = true
    
    const response = await fetch('http://localhost:3013/practice/detail/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setId: Number(route.params.id),
        practiceId: practiceId.value,
        timeUse: formatTimeForSubmit(timer.value),
        submitTime: formatSubmitTime()
      })
    })

    const data = await response.json()
    if (data.success) {
      isSubmitted.value = true
      // 跳转到总结页面
      router.push({
        name: 'PracticeSummary',
        params: { id: route.params.id },
        query: { practiceId: practiceId.value.toString() }
      })
    } else {
      throw new Error(data.message || '提交失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
    showSubmitConfirm.value = false
  }
}

// 添加获取得分详情的函数
const getScoreDetail = async () => {
  try {
    // 跳转到总结页面，将 practiceId 作为 query 参数传递
    router.push({
      name: 'PracticeSummary',
      params: { id: route.params.id },
      query: { practiceId: practiceId.value?.toString() }
    })
  } catch (error) {
    console.error('获取得分失败:', error)
    alert('获取得分失败：' + (error instanceof Error ? error.message : '请重试'))
  }
}

// 时器
const startTimer = () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (!timerPaused.value) {
        timer.value++
      }
    }, 1000)
  }
}

const toggleTimer = () => {
  timerPaused.value = !timerPaused.value
  if (timerPaused.value && timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  } else {
    startTimer()
  }
}

const toggleMark = (index: number) => {
  if (markedQuestions.value.has(index)) {
    markedQuestions.value.delete(index)
  } else {
    markedQuestions.value.add(index)
  }
}

// 修改自动保存的逻辑
const startAutoSave = () => {
  autoSaveTimer.value = window.setInterval(async () => {
    if (selectedOption.value.length > 0 && !isSubmitted.value) {
      try {
        await submitSingleAnswer()
      } catch (error) {
        console.error('自动保存失败:', error)
      }
    }
  }, 30000)
}

// 添加错误提示函数
const showError = (message: string) => {
  // 这里可以替换成你喜欢的提示方式，比如 Element Plus 的 Message 组件
  alert(message)
}

// 修改提交单个题目的函数
const submitSingleAnswer = async () => {
  if (!currentSubject.value || selectedOption.value.length === 0) return

  try {
    const timeStr = formatTimeForSubmit(timer.value)
    const authInfo = localStorage.getItem('userAuthInfo')
    const { tokenValue = '' } = authInfo ? JSON.parse(authInfo) : {}

    const response = await fetch('http://localhost:3013/practice/detail/submitSubject', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Satoken': tokenValue ? `mianbao ${tokenValue}` : ''
      },
      body: JSON.stringify({
        practiceId: Number(practiceId.value),
        subjectId: Number(currentSubject.value.id),
        answerContents: selectedOption.value,
        subjectType: currentSubject.value.subjectType,
        timeUse: timeStr
      })
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || '提交失败')
    }

    // 提交成功后更新本地答案状态
    const answerIndex = answers.value.findIndex(a => a.subjectId === currentSubject.value.subjectId)
    if (answerIndex !== -1) {
      answers.value[answerIndex].isSubmitted = true
      // 更新本地存储
      localStorage.setItem('practiceAnswers', JSON.stringify(answers.value))
    }

  } catch (error) {
    console.error('提交答案失败:', error)
    showError('答案已暂存，但提交失败：' + (error instanceof Error ? error.message : '请检查网络后重试'))
  }
}

// 修改监听逻辑，移除自动提交
watch([selectedOption, answerContent], () => {
  const currentSubject = subjects.value?.[currentIndex.value]
  if (!currentSubject) return

  if (currentSubject.subjectType === 4) {
    // 简答题，当内容变化时更新本地答案
    if (answerContent.value.trim()) {
      const answerIndex = answers.value.findIndex(a => a.subjectId === currentSubject.subjectId)
      const answer = {
        subjectId: currentSubject.subjectId,
        subjectType: currentSubject.subjectType,
        answer: [answerContent.value]
      }

      if (answerIndex === -1) {
        answers.value.push(answer)
      } else {
        answers.value[answerIndex] = answer
      }
    }
  }
})

// 处理简答题输入
const handleAnswerInput = () => {
  if (!currentSubject.value || currentSubject.value.subjectType !== 4) return
  
  // 更新本地答案记录
  const answerIndex = answers.value.findIndex(a => a.subjectId === currentSubject.value.subjectId)
  const answer = {
    subjectId: currentSubject.value.subjectId,
    subjectType: currentSubject.value.subjectType,
    answer: [answerContent.value]
  }

  if (answerIndex === -1) {
    answers.value.push(answer)
  } else {
    answers.value[answerIndex] = answer
  }
}

// 修改检查选项是否选中的函数
const isOptionSelected = (optionType: number): boolean => {
  // 确保 selectedOption.value 是数组
  if (!Array.isArray(selectedOption.value)) {
    return false
  }
  return selectedOption.value.includes(optionType)
}

onMounted(() => {
  // 从本地存储加载已保存的答案
  const savedAnswers = localStorage.getItem('practiceAnswers')
  if (savedAnswers) {
    answers.value = JSON.parse(savedAnswers)
  }
  
  fetchPracticeSubjects()
  startTimer()
  startAutoSave()

  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 清理定时器
watch(() => route.path, () => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

// 添加beforeunload处理函数
const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
  if (answers.value.length > 0 && !isSubmitted.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}
</script>

<style scoped>
/* 添加平滑过渡效果 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 添加选项悬浮效果 */
label {
  position: relative;
  overflow: hidden;
}

label::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease;
}

label:hover::after {
  opacity: 0.05;
}

/* 添加按钮点击效果 */
button:active {
  transform: scale(0.98);
}

/* 添加弹窗动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* 添加背景模糊效果 */
.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* 添加弹窗阴影效果 */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 添加一些动画效果 */
@keyframes slide-in {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

/* 滚动条美化 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 2px;
}
</style> 