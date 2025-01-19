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
                {{ currentSubject?.subjectType === 1 ? '选择题' : '简答题' }}
              </span>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fas fa-clock mr-2"></i>
                <span>建议用时：5分钟</span>
              </div>
            </div>

            <!-- 题目内容部分保持不变 -->
            ...

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
                  answers.some(a => a.subjectId === subject.subjectId)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
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
  subjectId: string
  subjectName: string
  subjectType: number
  subjectDesc: string
  optionList?: Option[]
}

interface Option {
  optionType: number
  optionContent: string
  isCorrect: number
}

interface Answer {
  subjectId: string
  answer: string | number
}

interface SubmitResponse {
  success: boolean
  message?: string
  data?: any
}

interface PracticeResponse {
  title: string
  subjectList: Subject[]
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
const selectedOption = ref<string | number | null>(null)
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
  return `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(secs).padStart(2, '0')}`
}

const formatSubmitTime = (): string => {
  const now = new Date()
  return now.toISOString().slice(0, 19).replace('T', ' ')
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
    
    // 根据题目类型调用不同的接口
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

    currentSubject.value = data.data
    selectedOption.value = null

    // 检查是否已有答案
    const existingAnswer = answers.value.find(a => a.subjectId === subject.subjectId)
    if (existingAnswer) {
      selectedOption.value = existingAnswer.answer
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    alert('获取题目失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
  }
}

// 修改选项选择的处理函数
const handleOptionSelect = (optionType: number) => {
  selectedOption.value = optionType
  
  // 更新本地答案记录
  const currentSubject = subjects.value[currentIndex.value]
  const answerIndex = answers.value.findIndex(a => a.subjectId === currentSubject.subjectId)
  const answer = {
    subjectId: currentSubject.subjectId,
    subjectType: currentSubject.subjectType,
    answer: optionType
  }

  if (answerIndex === -1) {
    answers.value.push(answer)
  } else {
    answers.value[answerIndex] = answer
  }
}

// 上一题
const prevQuestion = async () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    await fetchCurrentSubject()
    loadSavedAnswer()
  }
}

// 修改下一题函数，保持简单的提交逻辑
const nextQuestion = async () => {
  if (!subjects.value?.length || selectedOption.value === null) return
  
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
          answerContents: [selectedOption.value],
          subjectType: currentSubject.subjectType,
          timeUse: formatTimeForSubmit(timer.value)
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || '提交答案失败')
      }

      // 提交成功后再进入下一题
      currentIndex.value++
      await fetchCurrentSubject()
      loadSavedAnswer()
      
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

// 修改 prevQuestion 和 nextQuestion 函数，加载已保存的答案
const loadSavedAnswer = () => {
  if (!subjects.value || !subjects.value[currentIndex.value]) return
  
  const currentSubjectId = subjects.value[currentIndex.value].subjectId
  const savedAnswer = answers.value.find(a => a.subjectId === currentSubjectId)
  selectedOption.value = savedAnswer?.answer || null
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

const jumpToQuestion = async (index: number): Promise<void> => {
  if (!subjects.value || index >= subjects.value.length) return
  
  currentIndex.value = index
  await fetchCurrentSubject()
  loadSavedAnswer()
}

// 修改自动保存的逻辑
const startAutoSave = () => {
  autoSaveTimer.value = window.setInterval(async () => {
    if (selectedOption.value !== null && !isSubmitted.value) {
      try {
        await submitSingleQuestion()
      } catch (error) {
        console.error('自动保存失败:', error)
      }
    }
  }, 30000)
}

// 提交单个题目
const submitSingleQuestion = async (): Promise<void> => {
  if (!currentSubject.value || selectedOption.value === null) return

  try {
    const response = await fetch('http://localhost:3013/practice/detail/submitSubject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practiceId: practiceId.value,
        subjectId: currentSubject.value.subjectId,
        answerContents: [selectedOption.value],
        subjectType: currentSubject.value.subjectType,
        timeUse: formatTimeForSubmit(timer.value)
      })
    })

    const data: SubmitResponse = await response.json()
    if (!data.success) {
      throw new Error(data.message || '提交答案失败')
    }
  } catch (error) {
    console.error('提交答案失败:', error)
    throw error
  }
}

onMounted(() => {
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