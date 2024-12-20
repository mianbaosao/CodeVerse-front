import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Problems from '@/views/Problems.vue'
import ProblemDetail from '@/views/ProblemDetail.vue'
import ShortAnswerProblemDetail from '@/views/ShortAnswerProblemDetail.vue'
import Learn from '@/views/Learn.vue'
import Leaderboard from '@/views/Leaderboard.vue'

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
    }
  ]
})

export default router 