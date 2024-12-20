<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮 -->
      <button 
        @click="goBack"
        class="mb-6 text-gray-600 hover:text-gray-800 flex items-center group transition-all duration-300"
      >
        <i class="fas fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
        <span class="relative">
          返回题目列表
          <span class="absolute bottom-0 left-0 w-full h-0.5 bg-gray-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
        </span>
      </button>

      <div class="grid grid-cols-12 gap-6">
        <!-- 左侧题目描述 -->
        <div class="col-span-12 lg:col-span-6">
          <div class="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <!-- 题目头部 -->
            <div class="p-6 border-b border-gray-200 relative overflow-hidden">
              <div class="relative">
                <div class="flex items-center justify-between mb-4">
                  <h1 class="text-2xl font-bold text-gray-900 group">
                    <span class="text-gray-700">#{{ problem.id }}</span> {{ problem.title }}
                    <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-500"></span>
                  </h1>
                  <span class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full border border-green-200">
                    简单
                  </span>
                </div>
                <div class="flex items-center space-x-6 text-sm text-gray-600">
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-chart-line text-gray-500"></i>
                    <span>通过率：{{ problem.acceptanceRate }}%</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-thumbs-up text-gray-500"></i>
                    <span>赞：{{ problem.solutions }}</span>
                  </div>
                  <button class="flex items-center space-x-2 hover:text-gray-900 transition-colors">
                    <i class="fas fa-star"></i>
                    <span>收藏</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 题目内容 -->
            <div class="p-6 text-gray-800">
              <div class="prose max-w-none">
                <div class="mb-6 leading-relaxed">
                  <p class="mb-4 text-gray-900 text-base">{{ problem.description }}</p>
                  <div v-if="problem.examples && problem.examples.length > 0">
                    <div v-for="(example, index) in problem.examples" 
                      :key="index" 
                      class="mb-4 transform hover:scale-102 transition-transform"
                    >
                      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p class="font-medium text-gray-900 mb-2">示例 {{ index + 1}}:</p>
                        <div class="space-y-1 font-mono text-sm">
                          <div class="flex items-center space-x-2">
                            <span class="text-gray-700 font-semibold">输入：</span>
                            <span class="text-gray-900">{{ example.input }}</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <span class="text-gray-700 font-semibold">输出：</span>
                            <span class="text-gray-900">{{ example.output }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 提示部分 -->
                <div class="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <i class="fas fa-lightbulb text-gray-500 animate-pulse"></i>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-gray-900">提示：</h3>
                      <div class="mt-2 text-sm space-y-1">
                        <ul class="list-disc pl-5 space-y-1">
                          <li v-for="(hint, index) in problem.hints" 
                            :key="index"
                            class="text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            {{ hint }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧代码编辑器 -->
        <div class="col-span-12 lg:col-span-6 space-y-4">
          <div class="bg-white rounded-lg shadow-xl border border-gray-200">
            <!-- 语言选择器 -->
            <div class="border-b border-gray-200 p-4 bg-gray-50">
              <select 
                v-model="selectedLanguage" 
                class="bg-white text-gray-800 border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <!-- 代码编辑区 -->
            <div class="p-4">
              <div class="relative">
                <textarea
                  v-model="code"
                  class="w-full h-96 font-mono text-sm p-4 bg-white text-gray-900 border border-gray-200 rounded resize-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="在这里编写你的代码..."
                  @input="handleInput"
                  style="line-height: 1.5; letter-spacing: 0.5px;"
                ></textarea>
                <div class="absolute top-2 right-2 text-xs text-gray-500 font-medium">
                  {{ getLanguageMode() }}
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="border-t border-gray-200 p-4 bg-gray-50">
              <div class="flex justify-between">
                <button
                  @click="runCode"
                  class="px-4 py-2 bg-white text-gray-700 rounded border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <i class="fas fa-play text-gray-600"></i>
                  <span>运行</span>
                </button>
                <button
                  @click="submitCode"
                  class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded hover:from-emerald-600 hover:to-green-700 transition-colors flex items-center space-x-2"
                >
                  <i class="fas fa-paper-plane"></i>
                  <span>提交</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 执行结果 -->
          <div v-if="executionResult" 
            class="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-fade-in"
          >
            <h3 class="font-medium text-gray-900 mb-2 flex items-center">
              <i class="fas fa-terminal mr-2 text-gray-600"></i>
              执行结果
            </h3>
            <pre class="bg-gray-50 p-4 rounded text-sm text-gray-900 border border-gray-200 font-mono">{{ executionResult }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  acceptanceRate: number
  solutions: number
  examples: Array<{
    input: string
    output: string
  }>
  hints: string[]
}

const problem: Ref<Problem> = ref({
  id: 283,
  title: '移动零',
  difficulty: 'easy',
  description: '给定一个数组 nums，编写一个函数将所有 0 移到数组的末尾，同时保持非零元素的相对顺序。',
  acceptanceRate: 54.4,
  solutions: 2500,
  examples: [
    {
      input: 'nums = [0,1,0,3,12]',
      output: '[1,3,12,0,0]'
    },
    {
      input: 'nums = [0]',
      output: '[0]'
    }
  ],
  hints: [
    '1 ≤ nums.length ≤ 10⁴',
    '-2³¹ <= nums[i] <= 2³¹ - 1'
  ]
})

const selectedLanguage: Ref<string> = ref('java')
const code: Ref<string> = ref('')
const executionResult: Ref<string | null> = ref(null)

const getLanguageMode = () => {
  const modes = {
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
    cpp: 'C++'
  }
  return modes[selectedLanguage.value as keyof typeof modes]
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  code.value = target.value
}

const runCode = () => {
  executionResult.value = '运行成功！\n输出结果：[1,3,12,0,0]'
}

const submitCode = () => {
  console.log('提交代码:', code.value)
}

const goBack = () => {
  router.push('/problems')
}
</script>

<style scoped>
.prose {
  @apply text-gray-600;
}

.prose p {
  @apply mb-4;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* 移除代码编辑器的条纹背景 */
/* textarea {
  background-image: linear-gradient(transparent 50%, rgba(34, 197, 94, 0.05) 50%);
  background-size: 100% 3rem;
  background-position: 0 -2px;
} */

/* 添加悬浮效果 */
.transform:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-out;
}

/* 添加科技感光效 */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 添加按钮点击效果 */
button {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

button:active {
  transform: translateY(1px);
}
</style> 