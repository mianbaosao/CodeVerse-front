import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Home from '@/views/Home.vue'
import Problems from '@/views/Problems.vue'
import ProblemDetail from '@/views/ProblemDetail.vue'
import ShortAnswerProblemDetail from '@/views/ShortAnswerProblemDetail.vue'
import ChoiceProblemDetail from '@/views/ChoiceProblemDetail.vue'
import Learn from '@/views/Learn.vue'
import Leaderboard from '@/views/Leaderboard.vue'
import Login from '@/views/Login.vue'
import Community from '@/views/Community.vue'
import AddProblem from '@/views/AddProblem.vue'
import Practice from '@/views/Practice.vue'
import PracticeDetail from '@/views/PracticeDetail.vue'
import Interview from '@/views/Interview.vue'

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
    },
    {
      path: '/community',
      name: 'GPT',
      component: () => import('@/views/GPT.vue')
    },
    {
      path: '/add-problem',
      name: 'AddProblem',
      component: AddProblem
    },
    {
      path: '/practice',
      name: 'Practice',
      component: Practice
    },
    {
      path: '/practice/:id',
      name: 'PracticeDetail',
      component: PracticeDetail
    },
    {
      path: '/practice/:id/summary',
      name: 'PracticeSummary',
      component: () => import('@/views/PracticeSummary.vue')
    },
    {
      path: '/interview',
      name: 'Interview',
      component: Interview
    }
  ]
}) as Router

// 路由守卫
router.beforeEach(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // 检查是否需要认证
  const requiresAuth = ['/problem', '/choice', '/short-answer'].some(path => 
    to.path.startsWith(path)
  )
  
  if (requiresAuth) {
    // 从 userAuthInfo 获取登录状态
    const authInfo = localStorage.getItem('userAuthInfo')
    const { isLogin = false } = authInfo ? JSON.parse(authInfo) : {}
    
    if (!isLogin) {
      sessionStorage.setItem('loginRedirect', to.path)
      next('/login')
      return
    }
  }
  
  next()
})

export default router 