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
      <!-- 分类标签展示区域 -->
      <div class="mb-6 space-y-4">
        <!-- 主分类 -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-600">主分类：</span>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in primaryCategories"
              :key="category.id"
              @click="selectPrimaryCategory(category.id)"
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5"
              :class="[
                filterParams.categoryId === String(category.id)
                  ? 'bg-indigo-100 text-indigo-700 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category.categoryName }}
              <!-- 选中状态指示器 -->
              <span 
                class="ml-1 w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block transition-all duration-300"
                :class="{ 'opacity-100 scale-100': filterParams.categoryId === String(category.id), 'opacity-0 scale-0': filterParams.categoryId !== String(category.id) }"
              ></span>
            </button>
          </div>
        </div>

        <!-- 子分类 -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-600">子分类：</span>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="category in subCategories"
              :key="category.id"
              @click="selectSubCategory(category.id)"
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5"
              :class="[
                filterParams.categoryId === String(category.id)
                  ? 'bg-indigo-100 text-indigo-700 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category.categoryName }}
              <span 
                class="ml-1 w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block transition-all duration-300"
                :class="{ 'opacity-100 scale-100': filterParams.categoryId === String(category.id), 'opacity-0 scale-0': filterParams.categoryId !== String(category.id) }"
              ></span>
            </button>
          </div>
        </div>

        <!-- 标签 -->
        <div class="flex items-center space-x-2">
          <span class="text-gray-600">标签：</span>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="label in labels"
              :key="label.id"
              @click="selectLabel(label.id)"
              class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5"
              :class="[
                filterParams.labelId === String(label.id)
                  ? 'bg-indigo-100 text-indigo-700 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ label.labelName }}
              <span 
                class="ml-1 w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block transition-all duration-300"
                :class="{ 'opacity-100 scale-100': filterParams.labelId === String(label.id), 'opacity-0 scale-0': filterParams.labelId !== String(label.id) }"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- 添加简答题列表 -->
      <div class="mt-6">
        <div class="grid gap-4">
          <div v-for="problem in shortAnswerProblems" 
            :key="problem.id"
            @click="goToProblem(problem.id)"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group"
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

            <!-- 悬浮光效 -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/30 group-hover:to-purple-50/30 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-lg"></div>
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
      
      const savedCategoryId = sessionStorage.getItem('categoryId')
      if (savedCategoryId) {
        const category = data.data.find((c: Category) => String(c.id) === savedCategoryId)
        if (category) {
          await fetchSubCategories(category.id)
        }
      } else if (data.data.length > 0) {
        await fetchSubCategories(data.data[0].id)
      }
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
      
      const savedCategoryId = sessionStorage.getItem('categoryId')
      if (savedCategoryId) {
        const subCategory = data.data.find((c: Category) => String(c.id) === savedCategoryId)
        if (subCategory) {
          await fetchLabels(subCategory.id)
        }
      } else if (data.data.length > 0) {
        await fetchLabels(data.data[0].id)
      }
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
  labelId: '' as string | number,
  categoryId: '' as string | number,
  subjectType: 4,  // 默���简答题
  subjectDifficult: 1
})

// 监听 selectedType 变化
watch(selectedType, (newType) => {
  if (newType === 'programming') {
    return
  }
  
  // 只设置题目类型，不重置筛选条件
  filterParams.value.subjectType = newType === 'choice' ? 3 : 4
  
  // 从 sessionStorage 恢复筛选条件
  const savedCategoryId = sessionStorage.getItem('categoryId')
  const savedLabelId = sessionStorage.getItem('labelId')
  
  if (savedCategoryId) {
    filterParams.value.categoryId = savedCategoryId
  }
  if (savedLabelId) {
    filterParams.value.labelId = savedLabelId
  }
  
  fetchPrimaryCategories()
  fetchShortAnswerProblems()
})

// 选择主分类
const selectPrimaryCategory = async (categoryId: number) => {
  filterParams.value.categoryId = filterParams.value.categoryId === categoryId ? '' : String(categoryId)
  sessionStorage.setItem('categoryId', filterParams.value.categoryId)
  if (filterParams.value.categoryId) {
    await fetchSubCategories(categoryId)
  } else {
    subCategories.value = []
    labels.value = []
  }
  handleFilterChange()
}

// 选择子分类
const selectSubCategory = async (categoryId: number) => {
  filterParams.value.categoryId = filterParams.value.categoryId === categoryId ? '' : String(categoryId)
  sessionStorage.setItem('categoryId', filterParams.value.categoryId)  // 保存子分类ID
  if (filterParams.value.categoryId) {
    await fetchLabels(categoryId)
  } else {
    labels.value = []
  }
  handleFilterChange()
}

// 选择标签
const selectLabel = (labelId: number) => {
  filterParams.value.labelId = filterParams.value.labelId === labelId ? '' : String(labelId)
  sessionStorage.setItem('labelId', filterParams.value.labelId)
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
    console.error('获取简答题失败:', error)
  }
}

// 跳转到题目详情
const goToProblem = (id: number) => {
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
  // 从路由查询参数中获取题目类型和筛选条件
  const params = route.query
  if (params.type) {
    selectedType.value = params.type.toString()
  }
  
  if (selectedType.value !== 'programming') {
    filterParams.value.subjectType = selectedType.value === 'choice' ? 3 : 4
    
    // 恢复筛选条件
    if (params.categoryId) {
      filterParams.value.categoryId = params.categoryId.toString()
    }
    if (params.labelId) {
      filterParams.value.labelId = params.labelId.toString()
    }
    
    await fetchPrimaryCategories()
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
</style>