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
import request from '@/utils/request'

// 移动到单独的类型文件
interface ApiResponse<T = any> {
  success: boolean
  code: number
  message: string
  data: T
}

interface LoginResponse {
  LoginId: string
  Satoken: string
}

interface UserInfo {
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
    const response = await request.get<ApiResponse<LoginResponse>>(
      `/auth/user/doLogin?validCode=${validCode.value}`,
      { needAuth: false }
    )
    
    if (response.success) {
      // 保存登录状态、loginId 和 tokenValue
      localStorage.setItem('userAuthInfo', JSON.stringify(response.data))
      // 获取用户信息时需要认证头
      const userInfoStorage = localStorage.getItem('userAuthInfo')
      const { loginId = '', tokenValue = '' } = userInfoStorage ? JSON.parse(userInfoStorage) : {}

      const headers = {
        'satoken': tokenValue
      };
      const userResponse = await request.post<ApiResponse<UserInfo>>(
        '/user/getUserInfo',
        { userName: loginId },
          { headers }
      )
      
      if (userResponse.success) {
         localStorage.setItem('userInfo', JSON.stringify(userResponse.data))
        window.dispatchEvent(new Event('storage'))
        const redirect = sessionStorage.getItem('loginRedirect') || '/'
        sessionStorage.removeItem('loginRedirect')
        await router.push(redirect)
        window.location.reload()
      } else {
        throw new Error(userResponse.message)
      }
    } else {
      throw new Error(response.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    loading.value = false
  }
}
</script> 