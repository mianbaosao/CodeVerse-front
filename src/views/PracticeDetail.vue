<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 顶部标题和计时器 -->
      <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
        <div class="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
          <button 
            @click="toggleTimer" 
            class="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <i class="fas" :class="timerPaused ? 'fa-play' : 'fa-pause'"></i>
          </button>
          <div class="text-2xl font-mono text-gray-700 w-32 text-center tabular-nums">
            {{ formatTime(timer) }}
          </div>
        </div>
      </div>

      <!-- 题目区域 -->
      <div class="flex space-x-6">
        <!-- 左侧题目内容 -->
        <div v-if="loading" class="flex-1 bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>

        <div v-else class="flex-1 bg-white rounded-lg shadow-sm p-8">
          <!-- 题目编号和类型 -->
          <div class="flex items-center space-x-2 mb-6">
            <span class="text-gray-500">{{ currentIndex + 1 }}/{{ subjects.length }}</span>
            <div class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              [单选题]
            </div>
          </div>

          <!-- 题目内容 -->
          <div v-if="currentSubject" class="space-y-8">
            <h2 class="text-lg text-gray-800">{{ currentSubject.subjectName }}</h2>

            <!-- 选项列表 -->
            <div class="space-y-4">
              <label
                v-for="option in currentSubject.optionList"
                :key="option.optionType"
                class="flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
                :class="[
                  selectedOption === option.optionType
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                ]"
              >
                <input
                  type="radio"
                  :name="`question-${currentSubject.subjectId}`"
                  :value="option.optionType"
                  v-model="selectedOption"
                  class="hidden"
                  @change="handleOptionSelect(option.optionType)"
                />
                <span class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm"
                  :class="[
                    selectedOption === option.optionType
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-500'
                  ]"
                >
                  {{ String.fromCharCode(64 + option.optionType) }}
                </span>
                <span class="text-gray-700">{{ option.optionContent }}</span>
              </label>
            </div>
          </div>

          <!-- 在题目内容区域的底部添加导航按钮 -->
          <div class="flex justify-between mt-8">
            <button
              v-if="currentIndex > 0"
              @click="prevQuestion"
              class="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <i class="fas fa-arrow-left"></i>
              <span>上一题</span>
            </button>
            <div v-else class="w-24"></div>

            <button
              v-if="currentIndex < (subjects?.length || 0) - 1"
              @click="nextQuestion"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              :disabled="!selectedOption"
              :class="[
                !selectedOption ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <span>下一题</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- 在题目区域添加提示信息 -->
          <div class="text-sm text-gray-500 mt-4">
            <i class="fas fa-info-circle mr-1"></i>
            答案会自动保存，可以随时暂停或继续答题
          </div>
        </div>

        <!-- 右侧答题卡 -->
        <div class="w-64 bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-800 mb-4">答题卡</h3>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(subject, index) in subjects"
              :key="index"
              @click="jumpToQuestion(index)"
              class="w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 relative"
              :class="[
                answers.find(a => a.subjectId === subject.subjectId)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                currentIndex === index ? 'ring-2 ring-blue-500' : '',
                markedQuestions.has(index) ? 'border-2 border-yellow-400' : ''
              ]"
            >
              {{ index + 1 }}
              <i v-if="markedQuestions.has(index)" 
                class="fas fa-bookmark text-yellow-400 absolute -top-1 -right-1 text-xs"
              ></i>
            </button>
          </div>

          <!-- 标记和提交按钮 -->
          <div class="mt-6 space-y-3">
            <button 
              @click="toggleMark"
              class="w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              :class="[
                markedQuestions.has(currentIndex)
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <i class="fas fa-bookmark" :class="[
                markedQuestions.has(currentIndex) ? 'text-yellow-500' : 'text-gray-500'
              ]"></i>
              <span>{{ markedQuestions.has(currentIndex) ? '取消标记' : '标记一下' }}</span>
            </button>
            
            <button 
              @click="submitPractice"
              class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors relative group"
              :disabled="!subjects.length || answers.length !== subjects.length"
            >
              <span>提交答卷</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ !subjects.length ? '加载中...' : 
                   answers.length === subjects.length ? '点击提交答卷' : 
                   `还有 ${subjects.length - answers.length} 题未完成` }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Subject {
  subjectId: number
  subjectType: number
}

interface SubjectDetail {
  subjectName: string
  subjectType: number
  optionList: Array<{
    optionType: number
    optionContent: string
  }>
}

interface PracticeResponse {
  title: string
  subjectList: Subject[]
  practiceId: number
}

interface Answer {
  subjectId: number
  subjectType: number
  answer: number
}

const loading = ref(false)
const error = ref<string | null>(null)
const subjects = ref<Subject[]>([])
const currentIndex = ref(0)
const currentSubject = ref<SubjectDetail | null>(null)
const selectedOption = ref<number | null>(null)
const timer = ref(0)
const timerInterval = ref<number | null>(null)
const answers = ref<Answer[]>([])
const title = ref('')
const autoSaveTimer = ref<number | null>(null)
const practiceId = ref<number>(0)

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
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
    const response = await fetch('http://localhost:3013/practice/set/getPracticeSubject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subjectId: subject.subjectId,
        subjectType: subject.subjectType
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

// 添加格式化时间的工具函数
const formatTimeForSubmit = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(secs).padStart(2, '0')}`
}

const formatSubmitTime = () => {
  const now = new Date()
  return now.toISOString().slice(0, 19).replace('T', ' ')
}

// 修改提交练习的函数
const submitPractice = async () => {
  if (!subjects.value?.length) {
    alert('题目加载失败，请刷新页面重试')
    return
  }

  if (answers.value.length !== subjects.value.length) {
    alert('还有题目未完成，请检查答题卡')
    return
  }

  if (!confirm('确认提交答卷吗？提交后将无法修改。')) {
    return
  }

  try {
    loading.value = true
    
    // 先提交最后一题
    await submitSingleQuestion()
    
    // 然后提交整个练习
    const response = await fetch('http://localhost:3013/practice/detail/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setId: Number(route.params.id),
        practiceId: practiceId.value,
        timeUse: formatTimeForSubmit(timer.value),
        submitTime: formatSubmitTime(),
        answerList: answers.value.map(answer => ({
          subjectId: answer.subjectId,
          subjectType: answer.subjectType,
          answerContents: [answer.answer] // 将答案包装成数组
        }))
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
  timerInterval.value = window.setInterval(() => {
    timer.value++
  }, 1000)
}

// 修改 prevQuestion 和 nextQuestion 函数，加载已保存的答案
const loadSavedAnswer = () => {
  if (!subjects.value || !subjects.value[currentIndex.value]) return
  
  const currentSubjectId = subjects.value[currentIndex.value].subjectId
  const savedAnswer = answers.value.find(a => a.subjectId === currentSubjectId)
  selectedOption.value = savedAnswer?.answer || null
}

// 添加新的功能
const timerPaused = ref(false)
const markedQuestions = ref<Set<number>>(new Set())

const toggleTimer = () => {
  timerPaused.value = !timerPaused.value
  if (timerPaused.value) {
    clearInterval(timerInterval.value!)
  } else {
    startTimer()
  }
}

const toggleMark = () => {
  if (markedQuestions.value.has(currentIndex.value)) {
    markedQuestions.value.delete(currentIndex.value)
  } else {
    markedQuestions.value.add(currentIndex.value)
  }
}

const jumpToQuestion = async (index: number) => {
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

// 添加 isSubmitted 变量
const isSubmitted = ref(false)

onMounted(() => {
  fetchPracticeSubjects()
  startTimer()
  startAutoSave() // 启动自动保存

  window.addEventListener('beforeunload', (e) => {
    if (answers.value.length > 0 && !isSubmitted.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  })
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }
})
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
</style> 