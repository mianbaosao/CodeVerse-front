<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回按钮 -->
    <button 
      @click="router.push('/problems')"
      class="mb-6 text-gray-600 hover:text-gray-800 flex items-center group"
    >
      <i class="fas fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition-transform"></i>
      返回题目列表
    </button>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6">新增题目</h2>

      <!-- 题目类型选择 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">题目类型</label>
        <div class="flex space-x-4">
          <button
            v-for="type in problemTypes"
            :key="type.value"
            @click="form.subjectType = type.value"
            class="px-4 py-2 rounded-lg transition-all duration-300"
            :class="[
              form.subjectType === type.value
                ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 题目信息 -->
      <div class="space-y-6">
        <!-- 题目名称 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">题目名称</label>
          <input
            v-model="form.subjectName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
        </div>

        <!-- 难度和分数 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">难度</label>
            <select
              v-model="form.subjectDifficult"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option :value="1">中等</option>
              <option :value="2">困难</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分数</label>
            <input
              v-model="form.subjectScore"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- 分类选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <div class="space-y-4">
            <!-- 主分类 -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in primaryCategories"
                :key="category.id"
                @click="selectPrimaryCategory(category.id)"
                class="px-3 py-1 rounded-full text-sm transition-all duration-300"
                :class="[
                  form.categoryIds.includes(category.id)
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                ]"
              >
                {{ category.categoryName }}
              </button>
            </div>
            <!-- 子分类 -->
            <div v-if="subCategories.length > 0" class="flex flex-wrap gap-2">
              <button
                v-for="category in subCategories"
                :key="category.id"
                @click="selectSubCategory(category.id)"
                class="px-3 py-1 rounded-full text-sm transition-all duration-300"
                :class="[
                  form.categoryIds.includes(category.id)
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                ]"
              >
                {{ category.categoryName }}
              </button>
            </div>
          </div>
        </div>

        <!-- 标签选择 -->
        <div v-if="labels.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="label in labels"
              :key="label.id"
              @click="toggleLabel(label.id)"
              class="px-3 py-1 rounded-full text-sm transition-all duration-300"
              :class="[
                form.labelIds.includes(label.id)
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
              ]"
            >
              {{ label.labelName }}
            </button>
          </div>
        </div>

        <!-- 选择题选项 -->
        <div v-if="form.subjectType === 1">
          <label class="block text-sm font-medium text-gray-700 mb-2">选项</label>
          <div class="space-y-4">
            <div v-for="(option, index) in form.optionList" :key="index" class="flex items-center space-x-4">
              <input
                v-model="option.optionContent"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                :placeholder="`选项 ${index + 1}`"
              >
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  :name="'correct'"
                  :value="1"
                  v-model="option.isCorrect"
                  class="text-indigo-600"
                >
                <span class="text-sm text-gray-600">正确答案</span>
              </label>
              <button
                @click="removeOption(index)"
                class="text-red-500 hover:text-red-600"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button
              @click="addOption"
              class="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              <i class="fas fa-plus mr-1"></i>
              添加选项
            </button>
          </div>
        </div>

        <!-- 简答题答案 -->
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-2">答案</label>
          <textarea
            v-model="form.subjectAnswer"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- 题目解析 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">题目解析</label>
          <textarea
            v-model="form.subjectParse"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="mt-8 flex justify-end">
        <button
          @click="submitProblem"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          :disabled="submitting"
        >
          {{ submitting ? '提交中...' : '提交' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from '@vue/runtime-dom'
import { useRouter } from 'vue-router'

const router = useRouter()
const submitting = ref(false)

// 题目类型
const problemTypes = [
  { label: '选择题', value: 1 },
  { label: '简答题', value: 4 }
]

// 表单数据
const form = reactive({
  subjectName: '',
  subjectDifficult: 1,
  subjectType: 4,
  subjectScore: 2,
  subjectParse: '',
  subjectAnswer: '',
  categoryIds: [] as number[],
  labelIds: [] as number[],
  optionList: [
    { optionType: 1, optionContent: '', isCorrect: 1 },
    { optionType: 2, optionContent: '', isCorrect: 0 }
  ]
})

// 分类和标签数据
const primaryCategories = ref([])
const subCategories = ref([])
const labels = ref([])

// 获取主分类
const fetchPrimaryCategories = async () => {
  try {
    const response = await fetch('/subject/category/queryPrimaryCategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryType: 1 })
    })
    const data = await response.json()
    if (data.success) {
      primaryCategories.value = data.data
    }
  } catch (error) {
    console.error('获取主分类失败:', error)
  }
}

// 获取子分类
const fetchSubCategories = async (parentId: number) => {
  try {
    const response = await fetch('/subject/category/queryCategoryByPrimary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parentId: parentId,
        categoryType: 2
      })
    })
    const data = await response.json()
    if (data.success) {
      subCategories.value = data.data
    }
  } catch (error) {
    console.error('获取子分类失败:', error)
  }
}

// 获取标签
const fetchLabels = async (categoryId: number) => {
  try {
    const response = await fetch('/subject/label/queryByCategoryId', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId })
    })
    const data = await response.json()
    if (data.success) {
      labels.value = data.data
    }
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

// 选择主分类
const selectPrimaryCategory = async (categoryId: number) => {
  const index = form.categoryIds.indexOf(categoryId)
  if (index === -1) {
    form.categoryIds.push(categoryId)
    await fetchSubCategories(categoryId)
    await fetchLabels(categoryId)
  } else {
    form.categoryIds.splice(index, 1)
    subCategories.value = []
    labels.value = []
  }
}

// 选择子分类
const selectSubCategory = async (categoryId: number) => {
  const index = form.categoryIds.indexOf(categoryId)
  if (index === -1) {
    form.categoryIds.push(categoryId)
    await fetchLabels(categoryId)
  } else {
    form.categoryIds.splice(index, 1)
  }
}

// 切换标签
const toggleLabel = (labelId: number) => {
  const index = form.labelIds.indexOf(labelId)
  if (index === -1) {
    form.labelIds.push(labelId)
  } else {
    form.labelIds.splice(index, 1)
  }
}

// 添加选项
const addOption = () => {
  form.optionList.push({
    optionType: form.optionList.length + 1,
    optionContent: '',
    isCorrect: 0
  })
}

// 移除选项
const removeOption = (index: number) => {
  form.optionList.splice(index, 1)
  // 更新选项类型
  form.optionList.forEach((option, i) => {
    option.optionType = i + 1
  })
}

// 提交题目
const submitProblem = async () => {
  try {
    submitting.value = true
    const authInfo = localStorage.getItem('userAuthInfo')
    const { tokenValue = '' } = authInfo ? JSON.parse(authInfo) : {}

    const response = await fetch('/subject/subject/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Satoken': 'mianbao ' + tokenValue
      },
      body: JSON.stringify({
        ...form,
        optionList: form.subjectType === 1 ? form.optionList : []
      })
    })

    const data = await response.json()
    if (data.success) {
      alert('添加成功')
      router.push('/problems')
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('添加题目失败:', error)
    alert('添加失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    submitting.value = false
  }
}

// 组件挂载时获取分类
onMounted(() => {
  fetchPrimaryCategories()
})
</script> 