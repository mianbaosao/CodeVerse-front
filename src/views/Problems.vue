<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 题型选择标签栏 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="type in problemTypes"
          :key="type.value"
          @click="selectedType = type.value"
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

    <!-- 编程题列表 -->
    <template v-if="selectedType === 'programming'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" 
                :key="header"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="problem in problems" 
              :key="problem.id"
              @click="goToProblem(problem.id)"
              class="hover:bg-gray-50 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <td class="px-6 py-4 whitespace-nowrap group-hover:text-indigo-600 transition-colors">
                {{ problem.title }}
                <!-- 题目悬浮光效 -->
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/30 group-hover:to-purple-50/30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 text-xs rounded-full transition-all duration-300': true,
                  'bg-green-100 text-green-800 group-hover:bg-green-200': problem.difficulty === 'easy',
                  'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200': problem.difficulty === 'medium',
                  'bg-red-100 text-red-800 group-hover:bg-red-200': problem.difficulty === 'hard'
                }">
                  {{ getDifficultyText(problem.difficulty) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 text-xs rounded-full transition-all duration-300': true,
                  'bg-green-100 text-green-800 group-hover:bg-green-200': problem.status === 'solved',
                  'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200': problem.status === 'attempted',
                  'bg-gray-100 text-gray-800 group-hover:bg-gray-200': problem.status === 'todo'
                }">
                  {{ problem.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap group-hover:text-indigo-600 transition-colors">
                {{ problem.solutions }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap group-hover:text-indigo-600 transition-colors">
                {{ problem.acceptanceRate }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 选择题和简答题的筛选区域 -->
    <template v-else>
      <!-- 分类导航区域 -->
      <div class="mb-8">
        <!-- 一级分类 -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="text-gray-500 font-medium">分类：</div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in primaryCategories"
              :key="category.id"
              @click.stop="(e) => {
                e.stopPropagation();
                selectPrimaryCategory(category.id);
              }"
              class="px-4 py-2 rounded-lg transition-all duration-300"
              :class="[
                filterParams.categoryId === String(category.id)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              ]"
            >
              {{ category.categoryName }}
            </button>
          </div>
        </div>

        <!-- 二级分类和标签 -->
        <div class="flex items-center space-x-4">
          <!-- 二级分类 -->
          <div v-if="subCategories.length" class="flex items-center space-x-2">
            <i class="fas fa-chevron-right text-gray-400"></i>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="category in subCategories"
                :key="category.id"
                @click.stop="(e) => {
                  e.stopPropagation();
                  selectSubCategory(category.id);
                }"
                class="px-3 py-1.5 rounded-lg text-sm transition-all duration-300"
                :class="[
                  filterParams.categoryId === String(category.id)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                ]"
              >
                {{ category.categoryName }}
              </button>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="labels.length" class="flex items-center space-x-2">
            <i class="fas fa-chevron-right text-gray-400"></i>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="label in labels"
                :key="label.id"
                @click.stop="(e) => {
                  e.stopPropagation();
                  selectLabel(label.id);
                }"
                class="px-2 py-1 rounded text-sm transition-all duration-300"
                :class="[
                  filterParams.labelId === String(label.id)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-tag text-xs mr-1 opacity-60"></i>
                {{ label.labelName }}
              </button>
            </div>
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
              <span :class="{
                'px-2 py-1 text-xs rounded-full transition-all duration-300': true,
                'bg-yellow-100 text-yellow-800': problem.subjectDifficult === 1,
                'bg-red-100 text-red-800': problem.subjectDifficult === 2
              }">
                {{ problem.subjectDifficult === 1 ? '中等' : '困难' }}
              </span>
            </div>
            
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center space-x-2">
                <i class="fas fa-folder text-gray-400"></i>
                <span>{{ problem.categoryName }}</span>
              </div>
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
              <div class="flex items-center space-x-2">
                <i class="fas fa-star text-gray-400"></i>
                <span>{{ problem.subjectScore }} 分</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'solved' | 'attempted' | 'todo'
  solutions: number
  acceptanceRate: number
}

interface ShortAnswerProblem {
  id: number
  subjectName: string
  subjectDifficult: 1 | 2  // 1-中等 2-困难
  subjectType: number
  subjectScore: number
  subjectParse: string
  labelName: string[]
  categoryName: string    // 添加分类名称
  subCategoryName?: string  // 添加子分类名称
}

const problemTypes = [
  { label: '编程题', value: 'programming', icon: 'fas fa-code', count: 2500 },
  { label: '选择题', value: 'choice', icon: 'fas fa-check-circle', count: 800 },
  { label: '简答题', value: 'short-answer', icon: 'fas fa-pen', count: 500 }
]

const selectedType: Ref<string> = ref('programming')
const problems: Problem[] = [
  {
    id: 3285,
    title: '找到稳定山的��标',
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

// 分页���关的状态
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)

// 修改接口类型���义
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

// 获取主分类
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
      // ���自动选择第一个分类
      subCategories.value = []
      labels.value = []
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
  }
}

// 获取子分类
const fetchSubCategories = async (parentId: number) => {
  try {
    const response = await fetch('http://localhost:3010/subject/category/queryCategoryByPrimary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parentId,
        categoryType: 2
      })
    })
    const data = await response.json()
    if (data.success) {
      subCategories.value = data.data
      // 默认不自动选择第一个子分类
      labels.value = []
    }
  } catch (error) {
    console.error('获取子分类失��:', error)
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
        categoryId
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

// 修改状态定义
const shortAnswerProblems: Ref<ShortAnswerProblem[]> = ref([])
const totalShortAnswers: Ref<number> = ref(0)

// 修改筛选条件
const filterParams = ref({
  labelId: '' as string,
  categoryId: '' as string,
  subjectType: 4 as number,  // 改回只支持单个数字
  subjectDifficult: 1
})

// 监听 selectedType 变化
watch(selectedType, (newType) => {
  if (newType === 'programming') {
    return
  }
  
  // 修改选择题的 subjectType 判断
  filterParams.value.subjectType = newType === 'choice' 
    ? 1  // 选择题只显示 subjectType 为 1 的题目
    : 4  // 简答题是 4
  
  // 如果没有保存的状态，才重置条件
  if (!sessionStorage.getItem('problemListState')) {
    currentPage.value = 1
    filterParams.value.categoryId = ''
    filterParams.value.labelId = ''
  }
  
  fetchPrimaryCategories()
  fetchShortAnswerProblems()
})

// 选择主分类
const selectPrimaryCategory = async (categoryId: number) => {
  // 如果点击的是当前选中的分类，则取消选中
  if (filterParams.value.categoryId === categoryId.toString()) {
    filterParams.value.categoryId = ''
    subCategories.value = []
    labels.value = []
  } else {
    // 否则选中新的分类
    filterParams.value.categoryId = categoryId.toString()
    await fetchSubCategories(categoryId)
  }
  handleFilterChange()
}

// 选择子分类
const selectSubCategory = async (categoryId: number) => {
  // 如果点击的是当前选中的子分类，则取消选中
  if (filterParams.value.categoryId === categoryId.toString()) {
    filterParams.value.categoryId = ''
    labels.value = []
  } else {
    // 否则选中新的子分类
    filterParams.value.categoryId = categoryId.toString()
    await fetchLabels(categoryId)
  }
  handleFilterChange()
}

// 选择标签
const selectLabel = (labelId: number) => {
  filterParams.value.labelId = filterParams.value.labelId === labelId.toString() 
    ? '' 
    : labelId.toString()
  handleFilterChange()
}

// 统一的筛选处理函数
const handleFilterChange = () => {
  currentPage.value = 1 // 重置页码
  fetchShortAnswerProblems()
}

// 获取简答题
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
        ...filterParams.value,
        ...(filterParams.value.labelId ? { labelId: filterParams.value.labelId } : {}),
        ...(filterParams.value.categoryId ? { categoryId: filterParams.value.categoryId } : {})
      })
    })
    const data = await response.json()
    if (data.success) {
      shortAnswerProblems.value = data.data.result
      totalShortAnswers.value = data.data.total
      totalPages.value = Math.ceil(data.data.total / pageSize.value)
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

// 难度转换
const getDifficultyText = (difficulty: string) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty as keyof typeof map]
}

// 监听分页变化
watch(currentPage, () => {
  if (selectedType.value !== 'programming') {
    fetchShortAnswerProblems()
  }
})

onMounted(async () => {
  // 从路由查询参数中获取题目类型
  const params = route.query
  if (params.type) {
    selectedType.value = params.type.toString()
  }
  
  if (selectedType.value !== 'programming') {
    filterParams.value.subjectType = selectedType.value === 'choice' 
      ? 1  // 选择题只显示 subjectType 为 1 的题目
      : 4  // 简答题是 4
    
    // 尝试恢复保存的状态
    const savedState = sessionStorage.getItem('problemListState')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        filterParams.value.categoryId = state.categoryId || ''
        filterParams.value.labelId = state.labelId || ''
        currentPage.value = state.page || 1
        
        // 先获取主分类
        await fetchPrimaryCategories()
        
        // 如果有保存的分类ID，获取对应的子分类
        if (state.categoryId) {
          await fetchSubCategories(parseInt(state.categoryId))
          // 如果有保存的标签ID，获取对应的标签
          if (state.labelId) {
            await fetchLabels(parseInt(state.categoryId))
          }
        }
      } catch (e) {
        console.error('Error restoring state:', e)
        // 如果恢复失败，使用默认状态
        filterParams.value.categoryId = ''
        filterParams.value.labelId = ''
        currentPage.value = 1
        await fetchPrimaryCategories()
      }
    } else {
      // 如果没有保存的状态，使用默认状态
      filterParams.value.categoryId = ''
      filterParams.value.labelId = ''
      currentPage.value = 1
      await fetchPrimaryCategories()
    }
    
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

/* 优��标签切���动画 */
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