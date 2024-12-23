import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteLocationNormalized } from 'vue-router'
import Home from '@/views/Home.vue'
import Problems from '@/views/Problems.vue'
import ProblemDetail from '@/views/ProblemDetail.vue'
import ShortAnswerProblemDetail from '@/views/ShortAnswerProblemDetail.vue'
import ChoiceProblemDetail from '@/views/ChoiceProblemDetail.vue'
import Learn from '@/views/Learn.vue'
import Leaderboard from '@/views/Leaderboard.vue'
import Login from '@/views/Login.vue'

// 定义用户信息接口
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

// 创建获取用户信息的函数
async function fetchUserInfo(loginId: string) {
  try {
    const response = await fetch('http://localhost:3011/user/getUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: loginId
      })
    })
    const data = await response.json()
    if (data.success) {
      localStorage.setItem('userInfo', JSON.stringify(data.data))
      return true
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  return false
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/problems',
      name: 'Problems',
      component: Problems
    },
    {
      path: '/problem/:id',
      name: 'ProblemDetail',
      component: ProblemDetail
    },
    {
      path: '/choice/:id',
      name: 'ChoiceProblemDetail',
      component: ChoiceProblemDetail
    },
    {
      path: '/short-answer/:id',
      name: 'ShortAnswerProblemDetail',
      component: ShortAnswerProblemDetail
    },
    {
      path: '/learn',
      name: 'Learn',
      component: Learn
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
}) as Router

// 修改路由守卫
router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: (to?: string | false | void) => void
) => {
  // 检查是否有 loginId
  const loginId = localStorage.getItem('loginId')
  
  // 如果有 loginId，尝试获取用户信息
  if (loginId) {
    await fetchUserInfo(loginId)
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const requiresAuth = ['/problem', '/choice', '/short-answer'].some(path => 
    to.path.startsWith(path)
  )
  
  if (requiresAuth && !isLoggedIn) {
    sessionStorage.setItem('loginRedirect', to.path)
    next('/login')
  } else {
    next()
  }
})

export default router 