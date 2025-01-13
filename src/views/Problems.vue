<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 题型选择标签栏 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex justify-between items-center">
        <!-- 题型选择 -->
        <div class="flex space-x-8">
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
        </div>
        
        <!-- 出题按钮 -->
        <button
          @click="handleAddProblem"
          class="px-4 py-2 rounded-lg transition-all duration-300"
          :class="[
            hasAddPermission 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]"
          :title="hasAddPermission ? '点击出题' : '无出题权限'"
        >
          <div class="flex items-center space-x-2">
            <i class="fas fa-plus"></i>
            <span>出题</span>
          </div>
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
      <div v-if="selectedType === 5" class="space-y-6">
        <!-- 筛选器 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex flex-wrap gap-4">
            <!-- 难度选择 -->
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">难度：</span>
              <div class="flex space-x-2">
                <button
                  v-for="difficulty in difficulties"
                  :key="difficulty.value"
                  @click="handleDifficultyChange(difficulty.value)"
                  class="px-4 py-2 rounded-lg transition-all duration-300"
                  :class="[
                    filters.subjectDifficult === difficulty.value
                      ? difficulty.activeClass
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ difficulty.label }}
                </button>
              </div>
            </div>

            <!-- 标签选择 -->
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">标签：</span>
              <select
                v-model="filters.labelId"
                @change="handleFilterChange"
                class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">全部</option>
                <option value="68">数组</option>
                <option value="69">回溯</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 题目列表 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  题目
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  难度
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标签
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分数
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="problem in problems" :key="problem.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <router-link 
                    :to="`/problem/${problem.id}`"
                    class="text-gray-900 hover:text-indigo-600 font-medium"
                  >
                    {{ problem.subjectName }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getDifficultyClass(problem.subjectDifficult)
                  ]">
                    {{ getDifficultyLabel(problem.subjectDifficult) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex space-x-2">
                    <span 
                      v-for="label in problem.labelName" 
                      :key="label"
                      class="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                    >
                      {{ label }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  {{ problem.subjectScore }}分
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页器 -->
        <div class="flex justify-center mt-6">
          <div class="flex items-center space-x-2">
            <button
              @click="handlePageChange(pageInfo.pageNo - 1)"
              :disabled="pageInfo.pageNo === 1"
              class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left mr-1"></i>
              上一页
            </button>
            <div class="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <span class="text-gray-600">{{ pageInfo.pageNo }} / {{ pageInfo.totalPages }}</span>
            </div>
            <button
              @click="handlePageChange(pageInfo.pageNo + 1)"
              :disabled="pageInfo.pageNo === pageInfo.totalPages"
              class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
              <i class="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>

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
              @click.stop="goToProblem(problem.id, problem.subjectType)"
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

// 题型配置
const problemTypes = [
  { label: '编程题', value: 5, icon: 'fas fa-code', count: 2500 },
  { label: '选择题', value: 1, icon: 'fas fa-check-circle', count: 800 },
  { label: '简答题', value: 4, icon: 'fas fa-pencil-alt', count: 500 }
]

// 初始化 selectedType
const selectedType = ref<number>(5)  // 默认显示编程题

// 筛选条件
const filters = ref({
  labelId: '',
  categoryId: 26,  // 编程题固定值
  subjectType: 5,  // 编程题固定值
  subjectDifficult: 0
})

// 添加选择题和简答题需要的状态定义
const filterParams = ref({
  subjectType: 1,  // 默认为选择题
  categoryId: '',
  labelId: ''
})

const shortAnswerProblems: Ref<ShortAnswerProblem[]> = ref([])
const totalShortAnswers: Ref<number> = ref(0)

// 修改题型切换处理函数
const handleTypeChange = async (type: number) => {
  selectedType.value = type
  
  if (type === 5) {  // 编程题
    filters.value = {
      labelId: '',
      categoryId: 26,  // 编程题固定值
      subjectType: 5,  // 编程题固定值
      subjectDifficult: 0
    }
    fetchProblems()
  } else {  // 选择题和简答题
    filterParams.value.subjectType = type  // 1为选择题，4为简答题
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
}

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

// 选择主分类时的处理函数
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
  fetchShortAnswerProblems()
}

// 获取题目列表
const fetchShortAnswerProblems = async () => {
  try {
    // 从 userAuthInfo 获取认证信息
    const authInfo = localStorage.getItem('userAuthInfo')
    const { loginId, tokenValue } = authInfo ? JSON.parse(authInfo) : {}

    const response = await fetch('http://localhost:3010/subject/getSubjectPage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(loginId && { 'loginId': loginId }),
        ...(tokenValue && { 'Satoken': 'mianbao ' + tokenValue })
      },
      body: JSON.stringify({
        pageNo: currentPage.value,
        pageSize: pageSize.value,
        labelId: filterParams.value.labelId || undefined,
        categoryId: filterParams.value.categoryId || undefined,
        subjectType: filterParams.value.subjectType,
        subjectDifficult: 1
      })
    })

    const data = await response.json()
    if (data.success) {
      shortAnswerProblems.value = data.data.result
      totalShortAnswers.value = data.data.total
      totalPages.value = data.data.totalPages
    }
  } catch (error) {
    console.error('获取题目失败:', error)
  }
}

// 跳转到题目详情
const goToProblem = (id: number, type: number) => {
  // 保存当前状态
  sessionStorage.setItem('problemListState', JSON.stringify({
    type: selectedType.value,
    categoryId: filterParams.value.categoryId,
    labelId: filterParams.value.labelId,
    page: currentPage.value
  }))
  
  // 根据题目类型跳转到不同页面
  switch (type) {
    case 1: // 选择题
      router.push(`/choice/${id}`)
      break
    case 4: // 简答题
      router.push(`/short-answer/${id}`)
      break
    case 5: // 编程题
      router.push(`/problem/${id}`)
      break
    default:
      console.error('未知题目类型')
  }
}

// 监听分页变化
watch(currentPage, () => {
  if (selectedType.value !== 'programming') {
    fetchShortAnswerProblems()
  }
})

// 添加编程题接口定义
interface Problem {
  id: number
  subjectName: string
  subjectDifficult: number
  subjectType: number
  subjectScore: number
  labelName: string[]
}

const problems = ref<Problem[]>([])
const pageInfo = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

// 难度选项配置
const difficulties = [
  { label: '全部', value: 0, activeClass: 'bg-gray-600 text-white' },
  { label: '简单', value: 1, activeClass: 'bg-green-600 text-white' },
  { label: '中等', value: 2, activeClass: 'bg-yellow-600 text-white' },
  { label: '困难', value: 3, activeClass: 'bg-red-600 text-white' }
]

// 获取编程题列表
const fetchProblems = async () => {
  try {
    const response = await fetch('http://localhost:3010/subject/getSubjectPage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageNo: pageInfo.value.pageNo,
        pageSize: pageInfo.value.pageSize,
        labelId: filters.value.labelId || undefined,
        categoryId: 26,  // 编程题固定值
        subjectType: 5,  // 编程题固定值
        subjectDifficult: filters.value.subjectDifficult || undefined
      })
    })

    const data = await response.json()
    if (data.success) {
      problems.value = data.data.result
      pageInfo.value = {
        pageNo: data.data.pageNo,
        pageSize: data.data.pageSize,
        total: data.data.total,
        totalPages: data.data.totalPages
      }
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
  }
}

// 处理难度变更
const handleDifficultyChange = (difficulty: number) => {
  filters.value.subjectDifficult = difficulty
  pageInfo.value.pageNo = 1
  fetchProblems()
}

// 处理标签变更
const handleFilterChange = () => {
  pageInfo.value.pageNo = 1
  fetchProblems()
}

// 处理页码变更
const handlePageChange = (page: number) => {
  if (page < 1 || page > pageInfo.value.totalPages) return
  pageInfo.value.pageNo = page
  fetchProblems()
}

// 获取难度标签
const getDifficultyLabel = (difficult: number): string => {
  return ['', '简单', '中等', '困难'][difficult] || '未知'
}

// 获取难度样式
const getDifficultyClass = (difficult: number): string => {
  const classes = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  }
  return classes[difficult as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// 组件挂载时获取题目列表
onMounted(() => {
  fetchProblems()
})

// 添加权限状态
const hasAddPermission = ref(false)

// 添加检查权限的函数
const checkPermission = async () => {
  try {
    const authInfo = localStorage.getItem('userAuthInfo')
    const { loginId } = authInfo ? JSON.parse(authInfo) : {}
    
    if (!loginId) {
      return false
    }

    const response = await fetch(`http://localhost:3011/permission/getPermission?userName=${loginId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    if (data.success) {
      return data.data.includes('subject:add')
    }
  } catch (error) {
    console.error('检查权限失败:', error)
  }
  return false
}

// 处理出题按钮点击
const handleAddProblem = () => {
  if (hasAddPermission.value) {
    router.push('/add-problem')
  } else {
    alert('您没有出题权限')
  }
}

// 在组件挂载时检查权限
onMounted(async () => {
  hasAddPermission.value = await checkPermission()
})
</script><style scoped>
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

