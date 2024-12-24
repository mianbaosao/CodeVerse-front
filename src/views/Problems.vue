<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 题型选择标签栏 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="type in problemTypes"
          :key="type.value"
          @click="handleTypeChange(type.value)"
          class="group relative whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-300"
          :class="[
            selectedType === type.value
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center space-x-2">
            <i :class="[
              type.icon,
              'transition-transform duration-300 group-hover:scale-110',
              selectedType === type.value ? 'animate-bounce-small' : ''
            ]"></i>
            <span>{{ type.label }}</span>
            <span class="ml-2 text-gray-400 group-hover:text-gray-500 transition-colors">
              ({{ type.count }})
            </span>
          </div>
          <!-- 悬浮光效 -->
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50 group-hover:to-purple-50 transition-colors duration-300 rounded-lg -z-10"></div>
        </button>
      </nav>
    </div>

    <!-- 未选择题型时显示提示 -->
    <div v-if="!selectedType" class="text-center py-20">
      <div class="text-gray-400 mb-4">
        <i class="fas fa-hand-point-up text-4xl animate-bounce"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-600 mb-2">
        请选择题目类型
      </h3>
      <p class="text-gray-400">
        在上方选择你想要练习的题目类型
      </p>
    </div>

    <!-- 选择题型后显示对应的内容 -->
    <template v-else>
      <!-- 编程题列表 -->
      <template v-if="selectedType === 'programming'">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">解答</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通过率</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="problem in problems" 
                :key="problem.id"
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToProblem(problem.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                    {{ problem.title }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-green-100 text-green-800': problem.difficulty === 'easy',
                    'bg-yellow-100 text-yellow-800': problem.difficulty === 'medium',
                    'bg-red-100 text-red-800': problem.difficulty === 'hard'
                  }">
                    {{ getDifficultyText(problem.difficulty) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'flex items-center space-x-1': true,
                    'text-green-600': problem.status === 'solved',
                    'text-yellow-600': problem.status === 'attempted',
                    'text-gray-400': problem.status === 'todo'
                  }">
                    <i :class="{
                      'fas': true,
                      'fa-check-circle': problem.status === 'solved',
                      'fa-clock': problem.status === 'attempted',
                      'fa-circle': problem.status === 'todo'
                    }"></i>
                    <span class="text-sm">
                      {{ problem.status === 'solved' ? '已解答' : 
                         problem.status === 'attempted' ? '尝试过' : 
                         '待解答' }}
                    </span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ problem.solutions }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ problem.acceptanceRate }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- 选择题和简答题列表 -->
      <template v-else>
        <!-- 添加分类和标签筛选区域 -->
        <div class="mb-6 space-y-4">
          <!-- 主分类 -->
          <div class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700">主分类</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in primaryCategories"
                :key="category.id"
                @click="selectPrimaryCategory(category.id)"
                class="px-3 py-1 rounded-full text-sm transition-all duration-300"
                :class="[
                  String(category.id) === filterParams.categoryId
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                ]"
              >
                {{ category.categoryName }}
              </button>
            </div>
          </div>

          <!-- 子分类 -->
          <div v-if="subCategories.length > 0" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700">子分类</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in subCategories"
                :key="category.id"
                @click="selectSubCategory(category.id)"
                class="px-3 py-1 rounded-full text-sm transition-all duration-300"
                :class="[
                  String(category.id) === filterParams.categoryId
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                ]"
              >
                {{ category.categoryName }}
              </button>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="labels.length > 0" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700">标签</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="label in labels"
                :key="label.id"
                @click="selectLabel(label.id)"
                class="px-3 py-1 rounded-full text-sm transition-all duration-300"
                :class="[
                  String(label.id) === filterParams.labelId
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                ]"
              >
                {{ label.labelName }}
              </button>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div class="space-y-4">
          <div v-for="problem in shortAnswerProblems" 
            :key="problem.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300"
          >
            <div 
              class="cursor-pointer"
              @click.stop="goToProblem(problem.id)"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {{ problem.subjectName }}
                </h3>
                <div class="flex items-center space-x-4">
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full transition-all duration-300': true,
                    'bg-yellow-100 text-yellow-800': problem.subjectDifficult === 1,
                    'bg-red-100 text-red-800': problem.subjectDifficult === 2
                  }">
                    {{ problem.subjectDifficult === 1 ? '中等' : '困难' }}
                  </span>
                  <span class="text-gray-500 text-sm">
                    {{ problem.subjectScore }} 分
                  </span>
                </div>
              </div>
              
              <!-- 标签列表 -->
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-tag text-gray-400"></i>
                  <div class="flex gap-1">
                    <span v-for="(label, index) in problem.labelName" 
                      :key="index"
                      class="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
                    >
                      {{ label }}
                    </span>
                  </div>
                </div>
                <!-- 题目类型 -->
                <div class="flex items-center space-x-2">
                  <i :class="[
                    problem.subjectType === 4 ? 'fas fa-pen' : 'fas fa-check-circle',
                    'text-gray-400'
                  ]"></i>
                  <span>{{ problem.subjectType === 4 ? '简答题' : '选择题' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页器 -->
        <div class="mt-6 flex justify-center space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border transition-all duration-300"
            :class="[
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'hover:bg-indigo-50 text-indigo-600'
            ]"
          >
            上一页
          </button>
          <span class="px-3 py-1 text-gray-600">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border transition-all duration-300"
            :class="[
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'hover:bg-indigo-50 text-indigo-600'
            ]"
          >
            下一页
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface ShortAnswerProblem {
  id: number
  subjectName: string
  subjectDifficult: 1 | 2  // 1-中等 2-困难
  subjectType: number      // 4-简答题 1-选择题
  subjectScore: number
  subjectParse: string
  labelName: string[]      // 标签数组
}

const problemTypes = [
  { label: '编程题', value: 'programming', icon: 'fas fa-code', count: 2500 },
  { label: '选择题', value: 'choice', icon: 'fas fa-check-circle', count: 800 },
  { label: '简答题', value: 'short-answer', icon: 'fas fa-pen', count: 500 }
]

const selectedType: Ref<string> = ref('')

// 分页相关的状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 修改接口类型定义
interface Category {
  id: number
  categoryName: string
  categoryType: number
  parentId?: number
}

interface Label {
  id: number
  labelName: string
  categoryId: number
}

// 修改状态定义
const primaryCategories = ref<Category[]>([])
const subCategories = ref<Category[]>([])
const labels = ref<Label[]>([])

// 获取一级分类
const fetchPrimaryCategories = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/category/queryPrimaryCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categoryType: 1
      })
    })
    const data = await response.json()
    if (data.success) {
      primaryCategories.value = data.data
      subCategories.value = []
      labels.value = []
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
  }
}

// 获取二级分类
const fetchSubCategories = async (parentId: number) => {
  try {
    const response = await fetch('http://localhost:3010/subject/category/queryCategoryByPrimary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parentId: parentId,
        categoryType: 2
      })
    })
    const data = await response.json()
    if (data.success) {
      subCategories.value = data.data
      labels.value = []  // 清空标签列表
    }
  } catch (error) {
    console.error('获取子分类失败:', error)
  }
}

// 获取标签
const fetchLabels = async (categoryId: number) => {
  try {
    const response = await fetch('http://localhost:3010/subject/label/queryByCategoryId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categoryId: categoryId
      })
    })
    const data = await response.json()
    if (data.success) {
      labels.value = data.data
    }
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

// 修改选择主分类的函数
const selectPrimaryCategory = async (categoryId: number) => {
  // 如果点击的是当前选中的分类，则取消选中
  if (filterParams.value.categoryId === categoryId.toString()) {
    filterParams.value.categoryId = ''
    subCategories.value = []
    labels.value = []
  } else {
    // 选中新的分类并获取子分类和标签
    filterParams.value.categoryId = categoryId.toString()
    await fetchSubCategories(categoryId)
    await fetchLabels(categoryId)  // 获取标签
  }
  // 重置标签选择
  filterParams.value.labelId = ''
  // 重新获取题目列表
  fetchShortAnswerProblems()
}

// 修改选择子分类的函数
const selectSubCategory = async (categoryId: number) => {
  // 如果点击的是当前选中的子分类，则取消选中
  if (filterParams.value.categoryId === categoryId.toString()) {
    filterParams.value.categoryId = ''
    labels.value = []
  } else {
    // 选中新的子分类并获取标签
    filterParams.value.categoryId = categoryId.toString()
    await fetchLabels(categoryId)  // 获取标签
  }
  // 重置标签选择
  filterParams.value.labelId = ''
  // 重新获取题目列表
  fetchShortAnswerProblems()
}

// 选择标签
const selectLabel = (labelId: number) => {
  // 切换标签选择状态
  filterParams.value.labelId = filterParams.value.labelId === labelId.toString() 
    ? '' 
    : labelId.toString()
  // 重新获取题目列表
  fetchShortAnswerProblems()  // 根据当前选中的标签获取题目
}

// 获取题目列表
const fetchShortAnswerProblems = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/getSubjectPage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        labelId: filterParams.value.labelId || undefined,
        categoryId: filterParams.value.categoryId || undefined,
        subjectType: filterParams.value.subjectType,  // 4-简答题 1-选择题
        subjectDifficult: 1
      })
    })

    const data = await response.json()
    if (data.success) {
      shortAnswerProblems.value = data.data.result  // 修改为 result
      totalShortAnswers.value = data.data.total
      totalPages.value = data.data.totalPages  // 直接使用返回的 totalPages
    }
  } catch (error) {
    console.error('获取题目失败:', error)
  }
}

// 跳转到题目详情
const goToProblem = (id: number) => {
  // 保存当前状态
  sessionStorage.setItem('problemListState', JSON.stringify({
    type: selectedType.value,
    categoryId: filterParams.value.categoryId,
    labelId: filterParams.value.labelId,
    page: currentPage.value
  }))
  
  const path = {
    programming: '/problem',
    choice: '/choice',
    'short-answer': '/short-answer'
  }[selectedType.value]
  
  router.push(`${path}/${id}`)
}

// 监听分页变化
watch(currentPage, () => {
  if (selectedType.value !== 'programming') {
    fetchShortAnswerProblems()
  }
})

// 修改处理题型切换的函数
const handleTypeChange = async (type: string) => {
  selectedType.value = type
  if (type !== 'programming') {
    // 设置题目类型
    filterParams.value.subjectType = type === 'choice' ? 1 : 4
    
    // 获取保存的状态
    const savedState = sessionStorage.getItem('problemListState')
    if (savedState) {
      const state = JSON.parse(savedState)
      
      // 如果类型匹配，恢复保存的筛选条件
      if (state.type === type) {
        filterParams.value.categoryId = state.categoryId || ''
        filterParams.value.labelId = state.labelId || ''
        currentPage.value = state.page || 1
        
        // 先获取分类
        await fetchPrimaryCategories()
        
        // 如果有分类ID，获取子分类
        if (state.categoryId) {
          await fetchSubCategories(parseInt(state.categoryId))
        }
        
        // 获取题目列表
        await fetchShortAnswerProblems()
        return
      }
    }
    
    // 如果没有保存的状态或类型不匹配，重置筛选条件
    filterParams.value.categoryId = ''
    filterParams.value.labelId = ''
    currentPage.value = 1
    
    await fetchPrimaryCategories()
    await fetchShortAnswerProblems()
  }
}

// 确保组件挂载时调用
onMounted(async () => {
  console.log('Component mounted')
  
  // 先检查 URL 参数
  const query = route.query
  if (query.type) {
    await handleTypeChange(query.type.toString())
    
    // 如果有分类和标签参数，复它们
    if (query.categoryId) {
      filterParams.value.categoryId = query.categoryId.toString()
      await fetchSubCategories(parseInt(query.categoryId.toString()))
    }
    
    if (query.labelId) {
      filterParams.value.labelId = query.labelId.toString()
    }
    
    if (query.page) {
      currentPage.value = parseInt(query.page.toString())
    }
    
    // 获取题目列表
    await fetchShortAnswerProblems()
  }
  // 如果没有 URL 参数，再尝试从 sessionStorage 恢复
  else {
    const savedState = sessionStorage.getItem('problemListState')
    if (savedState) {
      const state = JSON.parse(savedState)
      await handleTypeChange(state.type)
      currentPage.value = state.page || 1
      
      if (state.categoryId) {
        filterParams.value.categoryId = state.categoryId
        await fetchSubCategories(parseInt(state.categoryId))
      }
      
      if (state.labelId) {
        filterParams.value.labelId = state.labelId
      }
      
      // 清除保存的状态
      sessionStorage.removeItem('problemListState')
    }
  }
})

// 添加编程题接口定义
interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'solved' | 'attempted' | 'todo'
  solutions: number
  acceptanceRate: number
}

// 添加默认的编程题数据
const problems: Problem[] = [
  {
    id: 3285,
    title: '找到稳定山的标',
    difficulty: 'easy',
    status: 'solved',
    solutions: 88,
    acceptanceRate: 92.9
  },
  {
    id: 1,
    title: '两数之和',
    difficulty: 'easy',
    status: 'solved',
    solutions: 26251,
    acceptanceRate: 54.4
  }
]

// 添加难度转换函数
const getDifficultyText = (difficulty: string) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty as keyof typeof map]
}

// 修改状态定义
const shortAnswerProblems: Ref<ShortAnswerProblem[]> = ref([])
const totalShortAnswers: Ref<number> = ref(0)

// 定义过滤参数接口
interface FilterParams {
  subjectType: number
  categoryId: string
  labelId: string
}

// 初始化过滤参数
const filterParams = ref<FilterParams>({
  subjectType: 4,  // 默认为简答题类型
  categoryId: '',
  labelId: ''
})

// 监听题目类型变化
watch(() => selectedType.value, async (newType) => {
  if (newType !== 'programming') {
    // 设置题目类型
    filterParams.value.subjectType = newType === 'choice' ? 1 : 4  // 选择题是1，简答题是4
    // 重置筛选条件
    filterParams.value.categoryId = ''
    filterParams.value.labelId = ''
    currentPage.value = 1
    // 获取主分类
    await fetchPrimaryCategories()
    // 清空子分类和标签
    subCategories.value = []
    labels.value = []
    // 获取题目列表
    fetchShortAnswerProblems()
  }
})
</script>

<style scoped>
/* 添加小弹跳动画 */
@keyframes bounce-small {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-bounce-small {
  animation: bounce-small 2s infinite;
}

/* 添加表格行悬浮效果 */
tr {
  position: relative;
  isolation: isolate;
}

/* 添加渐入动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

/* 优化标签切换动画 */
.border-b-2 {
  transition: border-color 0.3s ease, color 0.3s ease;
}

/* 添加按钮点击效果 */
button {
  transform: translateY(0);
  transition: all 0.2s ease;
}

button:active {
  transform: translateY(1px);
}

/* 添加卡片悬浮效果 */
.group {
  position: relative;
  isolation: isolate;
}

/* 添加标签悬浮效果 */
.bg-gray-100 {
  transition: all 0.2s ease;
}

.bg-gray-100:hover {
  @apply bg-gray-200;
}

/* 添加一些过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 添加选中状态的动画 */
button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease;
}

button:active::after {
  opacity: 0.1;
}
</style>