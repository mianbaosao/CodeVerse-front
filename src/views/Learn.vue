<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
    <div class="container mx-auto px-4">
      <!-- 标题 -->
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Java学习路线
        </h1>
        <p class="mt-2 text-gray-600">计算机专业四年学习规划</p>
      </div>

      <!-- 时间轴容器 -->
      <div class="timeline relative">
        <!-- 中心轴线 - 使用渐变色 -->
        <div class="absolute left-1/2 w-1 h-full transform -translate-x-1/2">
          <div class="h-full bg-gradient-to-b from-indigo-300 via-purple-400 to-pink-400"></div>
        </div>

        <!-- 学期节点 -->
        <div class="relative">
          <div 
            v-for="(semester, index) in semesters" 
            :key="semester.id"
            class="semester-node mb-16"
            :class="{ 'from-right': index % 2 === 0 }"
            :style="{ '--delay': `${index * 0.2}s` }"
          >
            <!-- 节点圆点 -->
            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div 
                class="node-dot w-8 h-8 rounded-full border-4 transition-all duration-500 cursor-pointer hover:scale-125"
                :class="getNodeClass(semester)"
              >
              </div>
            </div>

            <!-- 连接线 -->
            <div 
              class="connector absolute top-1/2 h-0.5 transform -translate-y-1/2 transition-all duration-500"
              :class="[
                index % 2 === 0 ? 'left-[50%]' : 'right-[50%]',
                getConnectorClass(semester)
              ]"
            >
              <!-- 流动光效 -->
              <div class="flow-light"></div>
            </div>

            <!-- 学期卡片 -->
            <div 
              class="semester-card w-[calc(50%-3rem)] p-6 rounded-xl transition-all duration-300 cursor-pointer"
              :class="[
                index % 2 === 0 ? 'ml-auto' : 'mr-auto',
                getCardClass(semester)
              ]"
              @mouseenter="handleCardHover(semester.id, true)"
              @mouseleave="handleCardHover(semester.id, false)"
            >
              <!-- 卡片头部 -->
              <div class="flex items-center justify-between mb-6">
                <h3 
                  class="text-xl font-bold bg-clip-text text-transparent"
                  :class="getTitleGradient(index)"
                >
                  {{ semester.name }}
                </h3>
              </div>

              <!-- 课程列表 -->
              <div class="space-y-4">
                <div 
                  v-for="course in semester.courses"
                  :key="course.id"
                  class="course-item p-4 rounded-xl relative overflow-hidden group cursor-pointer"
                  :class="getCourseItemClass(course, semester.id)"
                  @click="handleCourseClick(course)"
                  @mousemove="handleMouseMove"
                >
                  <!-- 鼠标跟随效果 -->
                  <div 
                    class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    :style="{
                      background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
                                  rgba(255,255,255,0.15) 0%, 
                                  transparent 60%)`
                    }"
                  ></div>

                  <!-- 进度条 -->
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/30">
                    <div 
                      class="h-full transition-all duration-500"
                      :class="[
                        'bg-gradient-to-r',
                        course.isCompleted ? 'from-green-400 to-green-500' :
                        course.isActive ? 'from-indigo-400 to-purple-500' :
                        'from-gray-200 to-gray-300'
                      ]"
                      :style="`width: ${course.isCompleted ? '100%' : '0%'}`"
                    ></div>
                  </div>

                  <!-- 装饰圆圈 -->
                  <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
                  <div class="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>

                  <!-- 课程内容 -->
                  <div class="relative">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div 
                          class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                          :class="getCourseIconClass(course)"
                        >
                          <i :class="['text-lg', course.icon]"></i>
                        </div>
                        <div>
                          <div class="flex items-center space-x-2">
                            <h4 class="font-medium">{{ course.title }}</h4>
                            <!-- 添加链接图标 -->
                            <div v-if="course.videoLink || course.practiceLink" 
                              class="flex items-center gap-2 ml-2"
                            >
                              <div v-if="course.videoLink" 
                                class="flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 text-xs"
                                title="视频教程"
                              >
                                <i class="fas fa-play-circle mr-1"></i>
                                <span class="hidden group-hover:inline">视频</span>
                              </div>
                              <div v-if="course.practiceLink" 
                                class="flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-500 text-xs"
                                title="在线练习"
                              >
                                <i class="fas fa-code mr-1"></i>
                                <span class="hidden group-hover:inline">练习</span>
                              </div>
                            </div>
                          </div>
                          <p class="text-sm text-gray-600">{{ course.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础容器样式 */
.container {
  max-width: 1200px;
}

/* 时间轴样式 */
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg,
    rgba(99, 102, 241, 0.3) 0%,
    rgba(168, 85, 247, 0.4) 50%,
    rgba(236, 72, 153, 0.3) 100%
  );
  transform: translateX(-50%);
  border-radius: 4px;
  box-shadow: 
    0 0 15px rgba(99, 102, 241, 0.2),
    0 0 30px rgba(168, 85, 247, 0.1);
}

/* 节点样式 */
.semester-node {
  opacity: 0;
  animation: slideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: calc(var(--index) * 0.2s);
}

.node-dot {
  box-shadow: 
    0 0 0 4px rgba(255, 255, 255, 0.9),
    0 0 0 8px rgba(99, 102, 241, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-dot:hover {
  transform: scale(1.2);
  box-shadow: 
    0 0 0 4px rgba(255, 255, 255, 1),
    0 0 0 8px rgba(99, 102, 241, 0.2),
    0 0 25px rgba(99, 102, 241, 0.4);
}

/* 连接线样式 */
.connector {
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(99, 102, 241, 0.4) 50%,
    transparent
  );
  overflow: hidden;
}

.flow-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.9),
    transparent
  );
  animation: flowLight 2s ease-in-out infinite;
}

/* 卡片样式 */
.semester-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.semester-card:hover {
  transform: 
    translateY(-6px)
    scale(1.02)
    rotateX(2deg)
    rotateY(2deg);
}

/* 课程卡片样式 */
.course-item {
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.4)
  );
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.course-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(99, 102, 241, 0.3),
    transparent
  );
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 0 15px rgba(99, 102, 241, 0.1);
}

/* 添加鼠标跟随效果 */
.course-item::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255,255,255,0.2) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.course-item:hover::after {
  opacity: 1;
}

/* 添加节点脉冲效果 */
.node-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.5;
  z-index: -1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 优化连接线动画 */
.connector::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

/* 添加交互提示动画 */
.course-item .hover-hint {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #6366f1;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s;
}

.course-item:hover .hover-hint {
  opacity: 1;
  transform: translateY(0);
}

/* 动画定义 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flowLight {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

// 类型定义
interface Course {
  id: number
  title: string
  description: string
  icon: string
  isActive: boolean
  isCompleted: boolean
  videoLink?: string
  practiceLink?: string
}

interface Semester {
  id: number
  name: string
  isActive: boolean
  courses: Course[]
  progress: number
}

// 状态定义
const semesters = ref<Semester[]>([
  {
    id: 1,
    name: '大一上学期',
    isActive: false,
    courses: [
      {
        id: 1,
        title: 'Java基础语法入门',
        description: '跟随黑马程序员视频学习Java基础知识',
        icon: 'fab fa-java',
        isActive: false,
        isCompleted: true,
        videoLink: 'https://www.bilibili.com/video/BV17F411T7Ao'
      },
      {
        id: 2,
        title: '洛谷入门题单',
        description: '通过ACM格式练习巩固基础语法',
        icon: 'fas fa-code',
        isActive: false,
        isCompleted: false,
        practiceLink: 'https://www.luogu.com.cn/'
      }
    ],
    progress: 100
  },
  {
    id: 2,
    name: '大一下学期',
    isActive: false,
    courses: [
      {
        id: 3,
        title: 'LeetCode算法进阶',
        description: '在LeetCode平台系统练习数据结构与算法',
        icon: 'fas fa-code',
        isActive: false,
        isCompleted: false,
        practiceLink: 'https://leetcode.cn/'
      },
      {
        id: 4,
        title: 'JavaWeb基础',
        description: '学习Spring、MyBatis等框架基础',
        icon: 'fas fa-globe',
        isActive: false,
        isCompleted: false,
        videoLink: 'https://www.bilibili.com/video/BV1m84y1w7Tb'
      },
      {
        id: 5,
        title: '项目实战学习',
        description: '跟随教程完成Web项目开发',
        icon: 'fas fa-project-diagram',
        isActive: false,
        isCompleted: false
      },
      {
        id: 6,
        title: '独立项目开发',
        description: '从0到1开发并部署个人项目',
        icon: 'fas fa-rocket',
        isActive: false,
        isCompleted: false
      }
    ],
    progress: 0
  },
  {
    id: 3,
    name: '大二上学期',
    isActive: false,
    courses: [
      {
        id: 7,
        title: '微服务架构精进',
        description: '学习Spring Cloud、Docker等微服务技术栈',
        icon: 'fas fa-cloud',
        isActive: false,
        isCompleted: false,
        videoLink: 'https://www.bilibili.com/video/BV1LQ4y127n4'
      },
      {
        id: 8,
        title: 'Java面试题总结',
        description: '系统学习Java核心技术原理，准备面试八股文',
        icon: 'fas fa-book',
        isActive: false,
        isCompleted: false,
        practiceLink: 'https://github.com/CyC2018/CS-Notes'
      },
      {
        id: 9,
        title: '简历优化和投递',
        description: '完善项目经验，制作简历，寒假投递实习岗位',
        icon: 'fas fa-paper-plane',
        isActive: false,
        isCompleted: false
      }
    ],
    progress: 0
  },
  {
    id: 4,
    name: '大二下学期',
    isActive: false,
    courses: [
      {
        id: 10,
        title: '算法刷题打卡',
        description: '保持每日刷题，巩固算法能力',
        icon: 'fas fa-laptop-code',
        isActive: false,
        isCompleted: false,
        practiceLink: 'https://leetcode.cn/problemset/all/'
      },
      {
        id: 11,
        title: '面试题深入',
        description: '深入理解技术原理，积累面试经验',
        icon: 'fas fa-brain',
        isActive: false,
        isCompleted: false,
        videoLink: 'https://www.bilibili.com/video/BV1yT411H7YK'
      },
      {
        id: 12,
        title: '实习准备',
        description: '投递简历，准备面试，争取暑期实习机会',
        icon: 'fas fa-briefcase',
        isActive: false,
        isCompleted: false
      },
      {
        id: 13,
        title: '项目深化',
        description: '改进现有项目，添加更多功能，提升技术深度',
        icon: 'fas fa-layer-group',
        isActive: false,
        isCompleted: false
      }
    ],
    progress: 0
  }
])

// 样式计算函数
const getStatusClasses = (item: Course | Semester, type: 'text' | 'bg' | 'border' | 'ring'): string => {
  const prefix = type === 'text' ? 'text' : type === 'bg' ? 'bg' : type === 'border' ? 'border' : 'ring'
  
  if ('isCompleted' in item && item.isCompleted) return `${prefix}-green-500`
  if (item.isActive) return `${prefix}-indigo-500`
  return `${prefix}-gray-300`
}

const getConnectorClass = (semester: Semester): string => getStatusClasses(semester, 'text')

// 修改学期卡片的渐变和动画效果
const getSemesterGradient = (semesterId: number): string => {
  const gradients = {
    1: 'from-blue-100/90 via-indigo-50/90 to-blue-50/90', // 大一上
    2: 'from-purple-100/90 via-violet-50/90 to-purple-50/90', // 大一下
    3: 'from-pink-100/90 via-rose-50/90 to-pink-50/90', // 大二上
    4: 'from-orange-100/90 via-amber-50/90 to-orange-50/90' // 大二下
  }
  return gradients[semesterId] || 'from-gray-100/90 via-slate-50/90 to-gray-50/90'
}

// 添加进度条动画
const getProgressStyle = (semester: Semester): string => {
  return `
    width: ${semester.progress}%;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  `
}

// 修改样式类
const getCardClass = (semester: Semester): string => {
  const classes = [
    'bg-gradient-to-br',
    getSemesterGradient(semester.id),
    'hover:shadow-2xl',
    'backdrop-blur-md',
    'border border-white/60',
    'transition-all duration-500',
    'hover:scale-[1.02]',
    'hover:-translate-y-2',
    'relative',
    'overflow-hidden'
  ]
  if (semester.isActive) {
    classes.push(`ring-2 ${getStatusClasses(semester, 'ring')}`)
  }
  return classes.join(' ')
}

// 修改课程卡片渐变，添加更强的悬浮效果
const getCourseGradient = (courseId: number, semesterId: number): string => {
  const gradients = {
    1: 'from-blue-100/30 to-indigo-100/30 hover:from-blue-200/50 hover:to-indigo-200/50', // Java基础
    2: 'from-green-100/30 to-emerald-100/30 hover:from-green-200/50 hover:to-emerald-200/50', // 洛谷刷题
    3: 'from-purple-100/30 to-violet-100/30 hover:from-purple-200/50 hover:to-violet-200/50', // LeetCode
    4: 'from-orange-100/30 to-amber-100/30 hover:from-orange-200/50 hover:to-amber-200/50', // JavaWeb
    5: 'from-pink-100/30 to-rose-100/30 hover:from-pink-200/50 hover:to-rose-200/50', // 项目实战
    6: 'from-cyan-100/30 to-sky-100/30 hover:from-cyan-200/50 hover:to-sky-200/50', // 独立项目
    7: 'from-teal-100/30 to-cyan-100/30 hover:from-teal-200/50 hover:to-cyan-200/50', // 微服务
    8: 'from-yellow-100/30 to-amber-100/30 hover:from-yellow-200/50 hover:to-amber-200/50', // 面试题
    9: 'from-red-100/30 to-rose-100/30 hover:from-red-200/50 hover:to-rose-200/50', // 简历
    10: 'from-lime-100/30 to-green-100/30 hover:from-lime-200/50 hover:to-green-200/50', // 算法
    11: 'from-fuchsia-100/30 to-pink-100/30 hover:from-fuchsia-200/50 hover:to-pink-200/50', // 面试深入
    12: 'from-sky-100/30 to-blue-100/30 hover:from-sky-200/50 hover:to-blue-200/50', // 实习
    13: 'from-violet-100/30 to-purple-100/30 hover:from-violet-200/50 hover:to-purple-200/50' // 项目
  }
  return gradients[courseId] || 'from-gray-100/30 to-slate-100/30 hover:from-gray-200/50 hover:to-slate-200/50'
}

// 修改课程卡片样式类
const getCourseItemClass = (course: Course, semesterId: number): string => {
  return `
    bg-gradient-to-br ${getCourseGradient(course.id, semesterId)}
    border border-white/50
    shadow-sm hover:shadow-xl
    backdrop-blur-sm
    transition-all duration-500
    hover:scale-[1.02]
    hover:-translate-y-1
    group
    cursor-pointer
  `
}

// 修改课程图标样式类
const getCourseIconClass = (course: Course): string => {
  const iconGradients = {
    1: 'bg-blue-100 text-blue-500',
    2: 'bg-green-100 text-green-500',
    3: 'bg-purple-100 text-purple-500',
    4: 'bg-orange-100 text-orange-500',
    5: 'bg-pink-100 text-pink-500',
    6: 'bg-cyan-100 text-cyan-500',
    7: 'bg-teal-100 text-teal-500',
    8: 'bg-yellow-100 text-yellow-600',
    9: 'bg-red-100 text-red-500',
    10: 'bg-lime-100 text-lime-600',
    11: 'bg-fuchsia-100 text-fuchsia-500',
    12: 'bg-sky-100 text-sky-500',
    13: 'bg-violet-100 text-violet-500'
  }
  return iconGradients[course.id] || 'bg-gray-100 text-gray-500'
}

const getNodeClass = (semester: Semester): string => {
  if (semester.isActive) return 'border-indigo-500 bg-indigo-100'
  if (semester.isCompleted) return 'border-green-500 bg-green-100'
  return 'border-gray-300 bg-white'
}

const getTitleGradient = (index: number): string => {
  const gradients = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-rose-500 to-rose-600'
  ]
  return `bg-gradient-to-r ${gradients[index % gradients.length]}`
}

const handleCardHover = (semesterId: number, isHovered: boolean): void => {
  const semester = semesters.value.find(s => s.id === semesterId)
  if (semester) {
    semester.isActive = isHovered
  }
}

// 添加点击反馈效果
const handleCourseClick = (course: Course): void => {
  // 添加点击波纹效果
  const ripple = document.createElement('div')
  ripple.className = 'ripple-effect'
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  event.currentTarget.appendChild(ripple)
  
  // 移除波纹效果
  setTimeout(() => ripple.remove(), 1000)

  // 如果有链接，添加跳转延迟以显示动画
  if (course.videoLink || course.practiceLink) {
    const link = course.videoLink || course.practiceLink
    setTimeout(() => {
      window.open(link, '_blank')
    }, 200)
  }
}

// 添加鼠标跟随效果处理函数
const handleMouseMove = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  target.style.setProperty('--x', `${x}%`)
  target.style.setProperty('--y', `${y}%`)
}

// 添加卡片悬浮状态管理
const hoveredCourseId = ref<number | null>(null)

const handleCourseHover = (courseId: number, isHovered: boolean): void => {
  hoveredCourseId.value = isHovered ? courseId : null
}
</script> 