<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <button 
        @click="goBack"
        class="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        返回题目列表
      </button>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <span class="text-lg font-bold text-gray-600">#{{ problem.id }}</span>
            <h2 class="text-xl font-bold">{{ problem.title }}</h2>
          </div>
          <span :class="{
            'px-3 py-1 text-sm rounded-full font-medium': true,
            'bg-green-100 text-green-800': problem.difficulty === 'easy',
            'bg-yellow-100 text-yellow-800': problem.difficulty === 'medium',
            'bg-red-100 text-red-800': problem.difficulty === 'hard'
          }">
            {{ getDifficultyText(problem.difficulty) }}
          </span>
        </div>

        <div class="prose max-w-none mb-8">
          <p class="text-lg">{{ problem.question }}</p>
        </div>

        <div class="space-y-4">
          <button
            v-for="(option, index) in problem.options"
            :key="index"
            class="w-full text-left p-4 border rounded-lg transition-colors relative"
            :class="{
              'hover:bg-gray-50': !isSubmitted,
              'bg-blue-50 border-blue-300': selectedAnswer === index && !isSubmitted,
              'bg-green-50 border-green-500': isSubmitted && index === problem.correctAnswer,
              'bg-red-50 border-red-300': isSubmitted && selectedAnswer === index && index !== problem.correctAnswer,
              'opacity-60': isSubmitted && index !== problem.correctAnswer && index !== selectedAnswer
            }"
            @click="selectAnswer(index)"
          >
            {{ option }}
            <span v-if="isSubmitted" class="absolute right-4 top-1/2 -translate-y-1/2">
              <i v-if="index === problem.correctAnswer" class="fas fa-check text-green-500"></i>
              <i v-else-if="selectedAnswer === index" class="fas fa-times text-red-500"></i>
            </span>
          </button>
        </div>

        <div v-if="feedback" 
          :class="{
            'mt-6 p-4 rounded-lg': true,
            'bg-green-50 text-green-800': selectedAnswer === problem.correctAnswer && isSubmitted,
            'bg-red-50 text-red-800': selectedAnswer !== problem.correctAnswer && isSubmitted,
            'bg-yellow-50 text-yellow-800': !isSubmitted
          }"
        >
          {{ feedback }}
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <button 
            v-if="!isSubmitted"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            @click="submitAnswer"
          >
            提交答案
          </button>
          <button 
            v-else
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            @click="goBack"
          >
            返回列表
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
const id = route.params.id

interface ChoiceProblem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const problem: Ref<ChoiceProblem> = ref({
  id: 1,
  title: '关于时间复杂度的描述',
  difficulty: 'easy',
  question: '以下哪个时间复杂度是最优的？',
  options: [
    'A. O(n²)',
    'B. O(n log n)',
    'C. O(n)',
    'D. O(1)'
  ],
  correctAnswer: 3, // D选项
  explanation: 'O(1) 表示常数时间复杂度，不随输入规模增加而增加，是最优的时间复杂度。'
})

const selectedAnswer: Ref<number | null> = ref(null)
const isSubmitted: Ref<boolean> = ref(false)
const feedback: Ref<string> = ref('')

const selectAnswer = (index: number) => {
  if (!isSubmitted.value) {
    selectedAnswer.value = index
  }
}

const submitAnswer = () => {
  if (selectedAnswer.value === null) {
    feedback.value = '请选择一个答案'
    return
  }

  isSubmitted.value = true
  if (selectedAnswer.value === problem.value.correctAnswer) {
    feedback.value = '回答正确！' + problem.value.explanation
  } else {
    feedback.value = '回答错误。' + problem.value.explanation
  }
}

const getDifficultyText = (difficulty: string) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty as keyof typeof map]
}

const goBack = () => {
  router.push('/problems')
}

onMounted(() => {
  console.log('Fetching problem:', id)
})
</script> 