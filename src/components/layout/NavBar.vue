<template>
  <nav 
    class="sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300"
    :class="[
      scrolled 
        ? 'bg-white/90 shadow-lg border-transparent' 
        : 'bg-white/80 shadow-sm border-gray-100'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center space-x-2 group">
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 relative">
              <!-- Logo 光效 -->
              <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300"></div>
              <span class="text-white font-bold relative z-10">C</span>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300">
              CodeVerse
            </span>
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
            :class="[
              $route.path === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
            ]"
          >
            <span class="relative z-10 flex items-center space-x-2">
              <i :class="[
                item.icon, 
                'transition-all duration-300 group-hover:scale-110',
                $route.path === item.path ? 'animate-bounce-small' : ''
              ]"></i>
              <span class="relative">
                {{ item.name }}
                <!-- 添加文字下方的装饰点 -->
                <span 
                  class="absolute -bottom-0.5 left-1/2 w-1 h-1 bg-indigo-400 rounded-full transform -translate-x-1/2 transition-all duration-300 opacity-0 scale-0"
                  :class="{ 'opacity-100 scale-100': $route.path === item.path }"
                ></span>
              </span>
            </span>
            <!-- 动态下划线效果 -->
            <div
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
              :class="{ 'scale-x-100': $route.path === item.path }"
            ></div>
            <!-- 悬浮光效 -->
            <div class="absolute inset-0 rounded-lg bg-indigo-400/0 group-hover:bg-indigo-400/5 transition-colors duration-300"></div>
          </router-link>

          <!-- 用户图标 -->
          <div class="relative">
            <template v-if="isLoggedIn && userInfo">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <div class="relative w-8 h-8">
                  <img 
                    v-if="userInfo.avatar" 
                    :src="userInfo.avatar" 
                    class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                    alt="用户头像"
                  >
                  <div 
                    v-else 
                    class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <i class="fas fa-user text-gray-400"></i>
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <span class="text-sm font-medium">{{ userInfo.nickName }}</span>
              </button>
              
              <!-- 下拉菜单 -->
              <div v-if="showUserMenu" 
                class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <div class="flex items-center space-x-3">
                    <div class="relative w-12 h-12">
                      <img 
                        v-if="userInfo.avatar" 
                        :src="userInfo.avatar" 
                        class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                        alt="用户头像"
                      >
                      <div 
                        v-else 
                        class="w-full h-full rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <i class="fas fa-user text-gray-400 text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ userInfo.nickName }}</div>
                      <div class="text-xs text-gray-500">{{ userInfo.email }}</div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 text-sm text-gray-600">
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-phone text-gray-400"></i>
                    <span>{{ userInfo.phone }}</span>
                  </div>
                  <div class="flex items-center space-x-2 mt-1">
                    <i class="fas fa-venus-mars text-gray-400"></i>
                    <span>{{ userInfo.sex === 1 ? '男' : '女' }}</span>
                  </div>
                  <div class="mt-2 text-xs text-gray-500">
                    <i class="fas fa-quote-left text-gray-400 mr-1"></i>
                    {{ userInfo.introduce || '这个人很懒，什么都没写~' }}
                  </div>
                </div>
                <div class="border-t border-gray-100 mt-2">
                  <button 
                    @click="showEditProfile = true"
                    class="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <i class="fas fa-user-edit mr-2"></i>
                    修改个人信息
                  </button>
                  <button 
                    @click="handleLogout"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    退出登录
                  </button>
                </div>
              </div>
            </template>
            
            <!-- 未登录状态 -->
            <router-link 
              v-else 
              to="/login"
              class="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i class="fas fa-user text-gray-400"></i>
              </div>
              <span class="text-sm">未登录</span>
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative overflow-hidden group"
          >
            <span class="sr-only">打开主菜单</span>
            <!-- 添加按钮动画效果 -->
            <div class="relative z-10">
              <i class="fas fa-bars text-xl transition-all duration-300"
                :class="{ 'opacity-0 rotate-180 scale-0': isMobileMenuOpen }"></i>
              <i class="fas fa-times text-xl absolute inset-0 transition-all duration-300"
                :class="{ 'opacity-100 rotate-0 scale-100': isMobileMenuOpen, 'opacity-0 -rotate-180 scale-0': !isMobileMenuOpen }"></i>
            </div>
            <!-- 按钮点击波纹效果 -->
            <div class="absolute inset-0 bg-indigo-400/10 transform scale-0 group-hover:scale-100 rounded-lg transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-show="isMobileMenuOpen" 
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 relative overflow-hidden group"
            :class="[
              $route.path === item.path
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <span class="relative z-10 flex items-center space-x-2">
              <i :class="[item.icon, 'transition-transform group-hover:scale-110 duration-200']"></i>
              <span>{{ item.name }}</span>
            </span>
            <!-- 移动菜单项悬浮效果 -->
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:to-purple-400/5 transition-colors duration-300"></div>
          </router-link>
        </div>
      </div>
    </div>
  </nav>

  <!-- 修改个人信息弹窗 -->
  <div v-if="showEditProfile" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-md p-6 relative">
      <button 
        @click="showEditProfile = false"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <i class="fas fa-times"></i>
      </button>
      
      <h3 class="text-lg font-medium text-gray-900 mb-4">修改个人信息</h3>
      
      <!-- 头像上传 -->
      <div class="mb-6 flex flex-col items-center">
        <div class="relative group">
          <img 
            :src="editForm.avatar || userInfo?.avatar" 
            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            alt="用户头像"
          >
          <div 
            class="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            @click="triggerFileInput"
          >
            <i class="fas fa-camera text-white text-xl"></i>
          </div>
          <input 
            type="file" 
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          >
        </div>
        <span class="text-sm text-gray-500 mt-2">点击更换头像</span>
      </div>

      <!-- 个人信息表单 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          <input 
            v-model="editForm.nickName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input 
            v-model="editForm.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
          <input 
            v-model="editForm.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <select 
            v-model="editForm.sex"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option :value="1">男</option>
            <option :value="2">女</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">个人介绍</label>
          <textarea 
            v-model="editForm.introduce"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="mt-6 flex justify-end">
        <button
          @click="handleSave"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          :disabled="saving"
        >
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from '@vue/runtime-dom'
import type { Ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

interface MenuItem {
  name: string
  path: string
  icon: string
}

const isMobileMenuOpen: Ref<boolean> = ref(false)

const menuItems: MenuItem[] = [
  { name: '首页', path: '/', icon: 'fas fa-home' },
  { name: '题库', path: '/problems', icon: 'fas fa-code' },
  { name: '学习路线', path: '/learn', icon: 'fas fa-road' },
  { name: '套卷练习', path: '/practice', icon: 'fas fa-book' },
  { name: '模拟面试', path: '/interview', icon: 'fas fa-comments' },
  { name: 'GPT', path: '/community', icon: 'fas fa-users' },
  { name: '排行榜', path: '/leaderboard', icon: 'fas fa-trophy' }
]

// 添加滚动监听
const scrolled: Ref<boolean> = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isLoggedIn = ref(false)
const showUserMenu = ref(false)

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

const userInfo = ref<UserInfo | null>(null)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  // 清除所有认证相关的本地存储
  localStorage.removeItem('userAuthInfo')
  localStorage.removeItem('userInfo')
  
  // 重置状态
  isLoggedIn.value = false
  userInfo.value = null
  showUserMenu.value = false
  
  // 跳转到首页
  router.push('/')
}

// 监听用户信息变化
watch(() => localStorage.getItem('userInfo'), (newValue) => {
  if (newValue) {
    userInfo.value = JSON.parse(newValue)
    isLoggedIn.value = true
  } else {
    userInfo.value = null
    isLoggedIn.value = false
  }
}, { immediate: true })

// 添加 router 实例
const router = useRouter()

// 修改登录状态检查
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target?.closest('.relative')) {
      showUserMenu.value = false
    }
  })
  
  // 从 userAuthInfo 获取登录状态
  const authInfo = localStorage.getItem('userAuthInfo')
  if (authInfo) {
    const { isLogin } = JSON.parse(authInfo)
    isLoggedIn.value = isLogin
  }
  
  const savedUserInfo = localStorage.getItem('userInfo')
  if (savedUserInfo) {
    userInfo.value = JSON.parse(savedUserInfo)
  }
})

const showEditProfile = ref(false)
const saving = ref(false)

// 添加文件输入引用
const fileInput = ref<HTMLInputElement | null>(null)

// 添加编辑表单
const editForm = ref({
  nickName: '',
  email: '',
  phone: '',
  sex: 1,
  introduce: '',
  avatar: ''
})

// 初始化编辑表单
watch(() => userInfo.value, (newUserInfo) => {
  if (newUserInfo) {
    editForm.value = {
      nickName: newUserInfo.nickName,
      email: newUserInfo.email,
      phone: newUserInfo.phone,
      sex: newUserInfo.sex,
      introduce: newUserInfo.introduce || '',
      avatar: newUserInfo.avatar || ''
    }
  }
}, { immediate: true })

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const formData = new FormData()
    
    formData.append('uploadFile', file)
    formData.append('bucket', 'user')
    formData.append('objectName', 'icon')

    try {
      // 从 userAuthInfo 获取 tokenValue
      const authInfo = localStorage.getItem('userAuthInfo')
      const { tokenValue = '' } = authInfo ? JSON.parse(authInfo) : {}

      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          'satoken': 'mianbao ' + tokenValue
        },
        body: formData,
        credentials: 'include'
      })
      
      const data = await response.json()

      if (data.success) {
        // 立即更新头像预览
        //console.log(data.data)
        const avatarUrl = data.data
        const previewImage = document.querySelector('.w-24.h-24.rounded-full') as HTMLImageElement
        if (previewImage) {
          previewImage.src = avatarUrl
        }
        // 保存到编辑表单中
        editForm.value.avatar = avatarUrl
      } else {
        throw new Error(data.message || '上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败：' + (error instanceof Error ? error.message : '请重试'))
    }
  }
}

// 保存修改
const handleSave = async () => {
  saving.value = true
  try {
    // 调用更新接口，包含头像的URL
    const response = await fetch('http://localhost:3011/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: userInfo.value?.userName,
        nickName: editForm.value.nickName,
        sex: editForm.value.sex,
        phone: editForm.value.phone,
        email: editForm.value.email,
        introduce: editForm.value.introduce,
        avatar: editForm.value.avatar  // 保存时一起更新头像
      })
    })

    const data = await response.json()
    if (data.success) {
      // 更新本地存储的用户信息
      const updatedUserInfo = {
        ...userInfo.value,
        ...editForm.value
      }
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
      
      // 触发用户信息更新
      window.dispatchEvent(new Event('storage'))
      
      // 关闭弹窗
      showEditProfile.value = false
      showUserMenu.value = false
      
      // 显示成功提示
      alert('保存成功！')
    } else {
      throw new Error(data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败：' + (error instanceof Error ? error.message : '请重试'))
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* 添加导航项悬浮动画 */
.router-link-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  border-radius: 8px;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.8);
}

.router-link-active:hover::before {
  opacity: 1;
  transform: scale(1);
}

/* 添加移动菜单动画 */
.md\:hidden {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加毛玻璃效果 */
.backdrop-blur-lg {
  backdrop-filter: blur(8px);
}

/* 添加导航栏滚动阴影效果 */
.sticky {
  transition: box-shadow 0.3s ease;
}

.sticky:not(.shadow-sm) {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 添加移动菜单展开/收起动画 */
.md\:hidden > div {
  transform-origin: top;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.md\:hidden[v-show="false"] > div {
  transform: scaleY(0);
  opacity: 0;
}

/* 添加导航项点击波纹效果 */
@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.router-link-active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgba(99, 102, 241, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加小弹跳动画 */
@keyframes bounce-small {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-bounce-small {
  animation: bounce-small 2s infinite;
}

/* 添加导航栏滚动渐变效果 */
nav {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

nav.scrolled {
  @apply shadow-lg bg-white/90;
  transform: translateY(-2px);
}
</style>

<script lang="ts">
export default {
  name: 'NavBar'
}
</script> 