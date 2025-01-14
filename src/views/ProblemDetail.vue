<template>
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧题目详情 -->
      <div class="col-span-12 lg:col-span-6 space-y-6">
        <!-- 返回按钮 -->
        <button 
          @click="goBack"
          class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i class="fas fa-arrow-left"></i>
          <span>返回题目列表</span>
        </button>

        <!-- 题目详情卡片 -->
        <div class="bg-white rounded-lg shadow-xl border border-gray-200">
          <!-- 题目标题和难度 -->
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ titleInfo?.subjectName || '加载中...' }}</h1>
              <p class="mt-2 text-gray-600">题目编号：{{ problem?.subjectId }}</p>
            </div>
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              getDifficultyClass(problem?.subjectDifficult)
            ]">
              {{ getDifficultyLabel(problem?.subjectDifficult) }}
            </span>
          </div>

          <!-- 题目描述 -->
          <div class="p-6 space-y-4 prose max-w-none">
            <div class="text-gray-600">{{ problem?.subjectDesc }}</div>
          </div>

          <!-- 示例 -->
          <div class="p-6 border-t border-gray-200 space-y-4">
            <h2 class="text-lg font-medium text-gray-900">示例：</h2>
            <div v-for="(num, index) in problem?.nums" :key="index" class="space-y-2">
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">输入：</span>
                  <code class="bg-gray-100 px-2 py-1 rounded text-indigo-600">
                   {{ JSON.stringify(num) }}
                  </code>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500">输出：</span>
                  <code class="bg-gray-100 px-2 py-1 rounded text-green-600">
                    {{ JSON.stringify(problem?.result[index]) }}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <!-- 提示 -->
          <div v-if="problem?.hints" class="p-6 border-t border-gray-200">
            <h2 class="text-lg font-medium text-gray-900 mb-4">提示：</h2>
            <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
              <ul class="list-disc list-inside space-y-2 text-gray-600">
                <li v-for="(hint, index) in formatHints(problem.hints)" :key="index">
                  {{ hint }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧代码编辑器 -->
      <div class="col-span-12 lg:col-span-6 space-y-4">
        <div class="bg-white rounded-lg shadow-xl border border-gray-200">
          <!-- 语言选择器和工具栏 -->
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
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

interface ProblemDetail {
  id: number
  subjectId: number
  subjectDesc: string
  subjectDifficult?: number
  nums: any[][]
  result: any[][]
  hints: string
}

interface TitleInfo {
  subjectName: string
  subjectDifficult: number
  subjectType: number
  subjectScore: number
  labelName: string[]
}

const problem = ref<ProblemDetail | null>(null)
const titleInfo = ref<TitleInfo | null>(null)

// 添加代码编辑器相关的状态
const selectedLanguage = ref('62')  // 默认选择 Java
const code = ref('')
const isFullscreen = ref(false)
const submitting = ref(false)
const executionResult = ref(null)

// 获取题目详情
const fetchProblemDetail = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/queryCodeSubjectInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: route.params.id
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

// 获取题目名称
const fetchTitleInfo = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/querySubjectInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: route.params.id
      })
    })

    const data = await response.json()
    if (data.success) {
      titleInfo.value = data.data
    }
  } catch (error) {
    console.error('获取题目名称失败:', error)
  }
}

// 格式化提示文本
const formatHints = (hints: string): string[] => {
  return hints
    .replace(/\\n/g, '\n')  // 替换转义的换行符
    .split('\n')
    .filter(hint => hint.trim())  // 过滤空行
}

// 获取难度标签
const getDifficultyLabel = (difficult?: number): string => {
  return ['', '简单', '中等', '困难'][difficult || 0] || '未知'
}

// 获取难度样式
const getDifficultyClass = (difficult?: number): string => {
  const classes = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  }
  return classes[difficult as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// 返回题目列表
const goBack = () => {
  router.push('/problems')
}

// 获取语言模板
const getLanguageTemplate = () => {
  const templates = {
    '62': `// 请在此处编写你的代码
public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        // 测试代码
    }
}

class Solution {
    // 请在此处编写解题代码
    
}`,
    '71': `class Solution:
    # 请在此处编写解题代码
    pass

# 测试代码
if __name__ == "__main__":
    solution = Solution()
    # 测试代码`,
    '63': `class Solution {
    // 请在此处编写解题代码
    
}

// 测试代码
const solution = new Solution();
// 测试代码`,
    '54': `class Solution {
public:
    // 请在此处编写解题代码
    
};

int main() {
    Solution solution;
    // 测试代码
    return 0;
}`
  }
  return templates[selectedLanguage.value as keyof typeof templates] || ''
}

// 处理全屏切换
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 处理Tab键
const handleTab = (e: KeyboardEvent) => {
  const target = e.target as HTMLTextAreaElement
  const start = target.selectionStart
  const end = target.selectionEnd

  code.value = code.value.substring(0, start) + '    ' + code.value.substring(end)
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 4
  })
}

// 添加 handleInput 函数定义
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  code.value = target.value
}

// 添加延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 修改状态描述转换函数，添加更多状态
const getStatusDescription = (statusId: number): string => {
  const statusMap: Record<number, string> = {
    1: '等待中',
    2: '处理中',
    3: '通过',
    4: '编译错误',
    5: '运行时错误',
    6: '答案错误',
    7: '时间超限',
    8: '内存超限',
    9: '输出超限',
    10: '系统错误'
  }
  return statusMap[statusId] || '未知状态'
}

// 修改运行和提交函数，添加错误处理
const handleSubmissionError = (error: unknown, type: '运行' | '提交') => {
  console.error(`${type}失败:`, error)
  if (error instanceof Error) {
    alert(`${type}失败：${error.message}`)
  } else if (typeof error === 'string') {
    alert(`${type}失败：${error}`)
  } else {
    alert(`${type}失败：请重试`)
  }
}

// 修改运行代码函数
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
        stdin: ''
      })
    })

    const data = await response.json()
    if (!data.token) {
      throw new Error('获取提交ID失败')
    }

    await delay(2000)

    const resultResponse = await fetch(`http://113.44.169.164:2358/submissions/${data.token}`)
    if (!resultResponse.ok) {
      throw new Error('获取结果失败')
    }

    executionResult.value = await resultResponse.json()
  } catch (error) {
    handleSubmissionError(error, '运行')
  } finally {
    submitting.value = false
  }
}

// 提交代码
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
        stdin: ''
      })
    })

    const submitData = await submitResponse.json()
    if (!submitData.token) {
      throw new Error('提交失败')
    }

    // 等待2秒后再获取结果
    await delay(2000)

    // 获取提交结果
    const resultResponse = await fetch(`http://113.44.169.164:2358/submissions/${submitData.token}`)
    const resultData = await resultResponse.json()
    executionResult.value = {
      ...resultData,
      status: {
        ...resultData.status,
        description: getStatusDescription(resultData.status.id)
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  // 并行获取题目名称和详情
  await Promise.all([
    fetchTitleInfo(),
    fetchProblemDetail()
  ])
})
</script>

<style scoped>
.prose {
  @apply text-gray-600;
}

.prose p {
  @apply mb-4;
}

/* 添加代码块样式 */
code {
  font-family: 'Fira Code', monospace;
}

/* 添加渐入动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style> 