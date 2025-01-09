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
            <div class="editor-container relative">
              <!-- 工具栏 -->
              <div class="border-b border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
                <select 
                  v-model="selectedLanguage" 
                  class="bg-white text-gray-800 border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="62">Java</option>
                  <option value="71">Python</option>
                  <option value="63">JavaScript</option>
                  <option value="54">C++</option>
                </select>

                <div class="flex items-center space-x-2">
                  <button
                    @click="toggleFullscreen"
                    class="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                    title="全屏编辑"
                  >
                    <i :class="['fas', isFullscreen ? 'fa-compress' : 'fa-expand']"></i>
                  </button>
                  <button
                    @click="runCode"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    :disabled="submitting"
                  >
                    <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : 'fa-play'"></i>
                    <span>{{ submitting ? '运行中...' : '运行' }}</span>
                  </button>
                  <button
                    @click="submitCode"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    :disabled="submitting"
                  >
                    <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                    <span>{{ submitting ? '提交中...' : '提交' }}</span>
                  </button>
                  <button
                    v-if="lastSubmitToken"
                    @click="checkSubmitResult"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    :disabled="submitting"
                  >
                    <i class="fas fa-history"></i>
                    <span>查看提交结果</span>
                  </button>
                </div>
              </div>

              <!-- 代码编辑器 -->
              <div class="relative" :class="{ 'h-screen': isFullscreen }">
                <textarea
                  v-model="code"
                  class="w-full h-[500px] font-mono text-sm p-4 bg-gray-50 focus:outline-none resize-none"
                  :class="{ 'h-full': isFullscreen }"
                  :placeholder="getLanguageTemplate()"
                  @input="handleInput"
                  @keydown.tab.prevent="handleTab"
                ></textarea>
              </div>
            </div>

            <!-- 在代码编辑器部分添加测试用例选择器 -->
            <div class="border-b border-gray-200 p-4 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-600">测试用例:</span>
                  <select 
                    v-model="selectedTestCase"
                    class="bg-white text-gray-800 border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option 
                      v-for="(example, index) in problem.examples"
                      :key="index"
                      :value="index"
                    >
                      测试用例 {{ index + 1 }}
                    </option>
                  </select>
                </div>
                <button
                  @click="resetCode"
                  class="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                >
                  <i class="fas fa-undo"></i>
                  <span>重置代码</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 执行结果 -->
          <div v-if="executionResult" 
            class="bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-900">执行结果</h3>
              <div :class="[
                'px-2 py-1 rounded-full text-sm',
                executionResult.status.id === 3 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]">
                {{ executionResult.status.description }}
              </div>
            </div>

            <!-- 输出结果 -->
            <div v-if="executionResult.stdout" class="mb-4">
              <div class="text-sm text-gray-600 mb-2">输出:</div>
              <pre class="bg-gray-50 p-3 rounded text-sm">{{ executionResult.stdout }}</pre>
            </div>

            <!-- 编译错误 -->
            <div v-if="executionResult.compile_output" class="mb-4">
              <div class="text-sm text-red-600 mb-2">编译错误:</div>
              <pre class="bg-red-50 p-3 rounded text-sm text-red-700">{{ executionResult.compile_output }}</pre>
            </div>

            <!-- 运行时错误 -->
            <div v-if="executionResult.stderr" class="mb-4">
              <div class="text-sm text-red-600 mb-2">运行时错误:</div>
              <pre class="bg-red-50 p-3 rounded text-sm text-red-700">{{ executionResult.stderr }}</pre>
            </div>

            <!-- 执行统计 -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-50 p-3 rounded">
                <span class="text-gray-600">执行时间：</span>
                <span class="text-gray-900">{{ executionResult.time }}s</span>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <span class="text-gray-600">内存使用：</span>
                <span class="text-gray-900">{{ (executionResult.memory / 1024).toFixed(2) }}MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
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

interface ExecutionResult {
  stdout: string | null
  time: string
  memory: number
  stderr: string | null
  token: string
  compile_output: string | null
  message: string | null
  status: {
    id: number
    description: string
  }
}

const selectedLanguage = ref('62') // 默认选择 Java
const code = ref('')
const submitting = ref(false)
const executionResult: Ref<ExecutionResult | null> = ref(null)

// 添加新的响应式变量
const lastSubmitToken = ref('')

// 获取语言模板
const getLanguageTemplate = () => {
  const templates: Record<string, string> = {
    '62': `public class Main {
    public static void main(String[] args) {
        // 在这里编写你的代码
    }
}`,
    '71': `def main():
    # 在这里编写你的代码
    pass

if __name__ == "__main__":
    main()`,
    '63': `function main() {
    // 在这里编写你的代码
}

main();`,
    '54': `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码
    return 0;
}`
  }
  return templates[selectedLanguage.value] || ''
}

// 获取提交结果的通用函数
const getSubmissionResult = async (token: string) => {
  const resultResponse = await fetch(`http://113.44.169.164:2358/submissions/${token}`)
  const result = await resultResponse.json()
  
  // 如果结果还在处理中，等待后重试
  if (result.status.id === 1 || result.status.id === 2) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return getSubmissionResult(token)
  }
  
  return result
}

// 修改提交代码函数
const submitCode = async () => {
  if (!code.value.trim()) {
    alert('请输入代码')
    return
  }

  submitting.value = true
  try {
    const submitResponse = await fetch('http://113.44.169.164:2358/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: parseInt(selectedLanguage.value),
        source_code: code.value,
        stdin: ""
      })
    })

    const submitData = await submitResponse.json()
    if (!submitData.token) {
      throw new Error('提交失败')
    }

    // 保存最后一次提交的token
    lastSubmitToken.value = submitData.token

    // 获取提交结果
    const result = await getSubmissionResult(submitData.token)
    executionResult.value = {
      ...result,
      status: {
        ...result.status,
        description: getStatusDescription(result.status.id)
      }
    }

  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    submitting.value = false
  }
}

// 添加查看提交结果函数
const checkSubmitResult = async () => {
  if (!lastSubmitToken.value) {
    alert('没有可查看的提交记录')
    return
  }

  submitting.value = true
  try {
    const result = await getSubmissionResult(lastSubmitToken.value)
    executionResult.value = {
      ...result,
      status: {
        ...result.status,
        description: getStatusDescription(result.status.id)
      }
    }
  } catch (error) {
    console.error('获取结果失败:', error)
    alert('获取结果失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    submitting.value = false
  }
}

// 运行代码（使用示例输入）
const runCode = async () => {
  if (!code.value.trim()) {
    alert('请输入代码')
    return
  }

  submitting.value = true
  try {
    const response = await fetch('http://113.44.169.164:2358/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: parseInt(selectedLanguage.value),
        source_code: code.value,
        stdin: ""  // 不需要输入数据
      })
    })

    const data = await response.json()
    if (!data.token) {
      throw new Error('运行失败')
    }

    // 获取运行结果
    const resultResponse = await fetch(`http://113.44.169.164:2358/submissions/${data.token}`)
    const result = await resultResponse.json()
    
    executionResult.value = {
      ...result,
      status: {
        ...result.status,
        description: getStatusDescription(result.status.id)
      }
    }
  } catch (error) {
    console.error('运行失败:', error)
    alert('运行失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    submitting.value = false
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  code.value = target.value
}

const goBack = () => {
  router.push('/problems')
}

// 添加状态描述转换函数
const getStatusDescription = (statusId: number): string => {
  const statusMap: Record<number, string> = {
    1: '等待中',
    2: '处理中',
    3: '通过',
    4: '编译错误',
    5: '运行时错误',
    6: '超时',
    7: '内存超限',
    8: '输出超限',
    9: '其他错误'
  }
  return statusMap[statusId] || '未知状态'
}

// 添加重置代码功能
const resetCode = () => {
  code.value = getLanguageTemplate()
}

// 添加新的响应式变量
const selectedTestCase = ref(0)
const isFullscreen = ref(false)

// 添加全屏切换功能
const toggleFullscreen = () => {
  const editorContainer = document.querySelector('.editor-container')
  if (!editorContainer) return
  
  if (!document.fullscreenElement) {
    editorContainer.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 添加 Tab 键处理函数
const handleTab = (e: KeyboardEvent) => {
  const target = e.target as HTMLTextAreaElement
  const start = target.selectionStart
  const end = target.selectionEnd

  // 插入两个空格
  const newValue = code.value.substring(0, start) + '  ' + code.value.substring(end)
  code.value = newValue
  
  // 移动光标位置
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 2
  })
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

/* 全屏模式样式 */
.editor-container:fullscreen {
  background: white;
  padding: 1rem;
}

.editor-container:fullscreen textarea {
  height: calc(100vh - 8rem);
}

/* 添加代码编辑器的行号效果 */
textarea {
  background-image: linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%);
  background-size: 100% 3rem;
  line-height: 1.5rem;
}

/* 优化滚动条样式 */
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 