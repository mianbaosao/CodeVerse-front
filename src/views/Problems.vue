<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 题型选择标签栏 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="type in problemTypes"
          :key="type.value"
          @click="selectedType = type.value"
          :class="[
            'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
            selectedType === type.value
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <i :class="type.icon" class="mr-2"></i>
          {{ type.label }}
          <span class="ml-2 text-gray-400">({{ type.count }})</span>
        </button>
      </nav>
    </div>

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
              @click="goToProblem(problem.id)"
              class="hover:bg-gray-50 cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap">{{ problem.title }}</td>
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
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-green-100 text-green-800': problem.status === 'solved',
                  'bg-yellow-100 text-yellow-800': problem.status === 'attempted',
                  'bg-gray-100 text-gray-800': problem.status === 'todo'
                }">
                  {{ problem.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ problem.solutions }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ problem.acceptanceRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- 选择题和简答题的筛选区域 -->
    <template v-else>
      <!-- 分类标签展示区域 -->
      <div class="mb-6">
        <!-- 主分类 -->
        <div class="flex items-center space-x-2 mb-2">
          <span class="text-gray-600">主分类：</span>
          <button 
            v-for="category in primaryCategories" 
            :key="category.id"
            @click="selectPrimaryCategory(category.id)"
            :class="[
              'px-3 py-1 rounded-full text-sm',
              filterParams.categoryId === String(category.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ category.categoryName }}
          </button>
        </div>

        <!-- 子分类 -->
        <div class="flex items-center space-x-2 mb-2" v-if="subCategories.length">
          <span class="text-gray-600">子分类：</span>
          <button 
            v-for="category in subCategories" 
            :key="category.id"
            @click="selectSubCategory(category.id)"
            :class="[
              'px-3 py-1 rounded-full text-sm',
              filterParams.categoryId === String(category.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ category.categoryName }}
          </button>
        </div>

        <!-- 标签 -->
        <div class="flex items-center space-x-2" v-if="labels.length">
          <span class="text-gray-600">标签：</span>
          <button 
            v-for="label in labels" 
            :key="label.id"
            @click="selectLabel(label.id)"
            :class="[
              'px-3 py-1 rounded-full text-sm',
              filterParams.labelId === String(label.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ label.labelName }}
          </button>
        </div>
      </div>

      <!-- 题目列表 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="problem in shortAnswerProblems" 
            :key="problem.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToProblem(problem.id)"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="text-sm font-medium text-gray-900">{{ problem.subjectName }}</div>
                  <span :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-yellow-100 text-yellow-800': problem.subjectDifficult === 1,
                    'bg-red-100 text-red-800': problem.subjectDifficult === 2
                  }">
                    {{ problem.subjectDifficult === 1 ? '中等' : '困难' }}
                  </span>
                </div>
              </div>
              <div class="mt-2 flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500">分类：</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {{ problem.categoryName }}
                  </span>
                  <span v-if="problem.subCategoryName" 
                    class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                  >
                    {{ problem.subCategoryName }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-gray-500">标签：</span>
                  <span v-for="label in problem.labelName" 
                    :key="label"
                    class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                  >
                    {{ label }}
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 分页控件 -->
      <div class="mt-4 flex justify-between items-center">
        <div class="flex space-x-2">
          <button 
            class="pagination-button" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <button 
            class="pagination-button" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
        <div>
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
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
    title: '找到稳定山的下标',
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
  subjectType: 4,  // 默认简答题
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

// 筛选处理
const handleFilterChange = () => {
  currentPage.value = 1
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
.pagination-button {
  @apply px-3 py-1 rounded border;
}

.pagination-button:disabled {
  @apply bg-gray-100 text-gray-400 cursor-not-allowed;
}

.pagination-button:not(:disabled) {
  @apply hover:bg-blue-50 text-blue-500;
}
</style>