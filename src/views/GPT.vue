<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex space-x-6">
        <!-- 左侧模型选择和设置 -->
        <div class="w-64 space-y-4">
          <!-- 模型选择 -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-4">模型选择</h3>
            <div class="space-y-2">
              <button
                v-for="model in models"
                :key="model.id"
                @click="selectModel(model)"
                class="w-full p-3 rounded-lg text-left transition-all relative"
                :class="selectedModel.id === model.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'"
              >
                <div class="flex items-center space-x-3">
                  <i :class="model.icon"></i>
                  <span>{{ model.name }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- 对话设置 -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-4">对话设置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  温度 ({{ temperature }})
                </label>
                <input
                  v-model="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  class="w-full"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  最大长度
                </label>
                <select v-model="maxTokens" class="w-full rounded-lg border-gray-300">
                  <option value="1000">1000 tokens</option>
                  <option value="2000">2000 tokens</option>
                  <option value="4000">4000 tokens</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 快捷提示语 -->
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-4">快捷提示语</h3>
            <div class="space-y-2">
              <button
                v-for="(prompt, index) in quickPrompts"
                :key="index"
                @click="useQuickPrompt(prompt)"
                class="w-full p-2 rounded-lg text-left hover:bg-gray-50 transition-colors text-sm text-gray-600"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </div>

        <!-- 中间聊天区域 -->
        <div class="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- 聊天记录区域 -->
          <div class="h-[600px] overflow-y-auto p-6 space-y-4" ref="chatContainer">
            <div v-for="(message, index) in chatMessages" 
              :key="index"
              :class="[
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div :class="[
                'max-w-[80%] rounded-lg p-4 relative group',
                message.role === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              ]">
                <div class="whitespace-pre-wrap">{{ message.content }}</div>
                <!-- 消息操作按钮 -->
                <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click="copyMessage(message.content)"
                    class="p-1 hover:bg-black/10 rounded"
                    title="复制"
                  >
                    <i class="fas fa-copy text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 加载动画 -->
            <div v-if="loading" class="flex justify-start">
              <div class="bg-gray-100 rounded-lg p-4 flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex space-x-4">
              <textarea
                v-model="prompt"
                rows="3"
                class="flex-1 resize-none border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="输入你的问题..."
                @keydown.enter.prevent="generateText"
              ></textarea>
              <div class="flex flex-col space-y-2">
                <button
                  @click="generateText"
                  :disabled="loading || !prompt.trim()"
                  class="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
                <button
                  @click="clearChat"
                  class="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  title="清空对话"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧对话历史 -->
        <div class="w-64 bg-white rounded-xl shadow-sm p-4">
          <h3 class="text-lg font-medium text-gray-800 mb-4">对话历史</h3>
          <div class="space-y-2">
            <div
              v-for="(chat, index) in chatHistory"
              :key="index"
              class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="loadChat(chat)"
            >
              <div class="text-sm font-medium text-gray-700 truncate">
                {{ chat.title }}
              </div>
              <div class="text-xs text-gray-500">
                {{ chat.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" 
        class="max-w-4xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface Model {
  id: string
  name: string
  icon: string
}

interface ChatHistory {
  title: string
  date: string
  messages?: ChatMessage[]
}

// 模型配置
const models: Model[] = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5', icon: 'fas fa-bolt' },
  { id: 'gpt-4', name: 'GPT-4', icon: 'fas fa-brain' }
]

// 快捷提示语
const quickPrompts: string[] = [
  '帮我解释一下这段代码',
  '这个问题如何优化？',
  '给我一些建议',
  '用更简单的方式解释'
]

const my_key = "sk-T6c5Bwnz67laZdm68f4411Ed73F942438fF9Bf543b34C933"
const prompt = ref<string>("")
const chatMessages = ref<ChatMessage[]>([])
const loading = ref<boolean>(false)
const error = ref<string>("")
const chatContainer = ref<HTMLElement | null>(null)
const selectedModel = ref<Model>(models[0])
const temperature = ref<number>(0.7)
const maxTokens = ref<number>(2000)

// 对话历史
const chatHistory = ref<ChatHistory[]>([
  { title: '上一次对话', date: '2024-03-20 15:30' },
  { title: '代码优化讨论', date: '2024-03-19 10:15' }
])

// 选择模型
const selectModel = (model: typeof models[0]) => {
  selectedModel.value = model
}

// 使用快捷提示语
const useQuickPrompt = (quickPrompt: string) => {
  prompt.value = quickPrompt
}

// 复制消息内容
const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    // 可以添加一个复制成功的提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 清空对话
const clearChat = () => {
  if (confirm('确定要清空当前对话吗？')) {
    chatMessages.value = []
  }
}

// 加载历史对话
const loadChat = (chat: typeof chatHistory.value[0]) => {
  // 这里可以实现加载历史对话的逻辑
  console.log('加载对话:', chat)
}

const generateText = async () => {
  if (!prompt.value.trim()) return

  try {
    loading.value = true
    error.value = ""

    chatMessages.value.push({
      role: "user",
      content: prompt.value
    })

    const userInput = prompt.value
    prompt.value = ""
    await scrollToBottom()

    const response = await fetch("https://api.xty.app/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${my_key}`
      },
      body: JSON.stringify({
        model: selectedModel.value.id,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...chatMessages.value.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: Number(temperature.value),
        max_tokens: Number(maxTokens.value)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "API 请求失败")
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || "获取回复失败")
    }

    chatMessages.value.push({
      role: "assistant",
      content: data.choices[0].message.content
    })

    await scrollToBottom()

  } catch (e) {
    error.value = e instanceof Error ? e.message : "发生错误，请稍后重试"
    console.error("GPT API 错误:", e)
  } finally {
    loading.value = false
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 监听聊天记录变化，自动滚动
watch(chatMessages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 保持原有样式并添加新的样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

/* 消息动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex > div {
  animation: fade-in-up 0.3s ease-out;
}

/* 添加悬浮效果 */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 添加过渡效果 */
.transition-all {
  transition: all 0.3s ease;
}
</style> 