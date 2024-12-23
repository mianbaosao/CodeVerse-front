<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">登录</h2>
        <p class="mt-2 text-gray-600">扫描二维码后输入验证码</p>
      </div>

      <div class="mt-8 space-y-6">
        <!-- 二维码图片 -->
        <div class="flex justify-center">
          <img src="E:\cursor\bread\src\views\image\mbgzh.jpg" alt="二维码" class="w-48 h-48 object-cover rounded-lg shadow-md">
        </div>

        <!-- 验证码输入框 -->
        <div>
          <input
            v-model="validCode"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="请输入验证码"
          >
        </div>

        <!-- 登录按钮 -->
        <button
          @click="handleLogin"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <span>{{ loading ? '登录中...' : '登录' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-dom'
import { useRouter } from 'vue-router'

interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  data: T
}

interface UserData {
  id: number
  userName: string
  nickName: string
  email: string
  phone: string
  sex: number
  avatar: string
  status: number
  introduce: string
}

const router = useRouter()
const validCode = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!validCode.value) {
    alert('请输入验证码')
    return
  }

  loading.value = true
  try {
    // 登录请求
    const response = await fetch(`http://localhost:3011/user/doLogin?validCode=${validCode.value}`)
    const data = await response.json() as ApiResponse<{ loginId: string }>
    
    if (data.success) {
      // 保存登录状态和 loginId
      const loginId = data.data.loginId
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('loginId', loginId)
      
      // 获取用户信息
      const userResponse = await fetch('http://localhost:3011/user/getUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: loginId
        })
      })
      const userData = await userResponse.json() as ApiResponse<UserData>
      
      if (userData.success) {
        localStorage.setItem('userInfo', JSON.stringify(userData.data))
        // 强制更新用户信息
        window.dispatchEvent(new Event('storage'))
        
        // 返回之前的页面或首页
        const redirect = sessionStorage.getItem('loginRedirect') || '/'
        sessionStorage.removeItem('loginRedirect')
        router.push(redirect)
      } else {
        throw new Error(userData.message)
      }
    } else {
      throw new Error(data.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
  }
}
</script> 