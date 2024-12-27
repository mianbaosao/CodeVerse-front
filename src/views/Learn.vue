<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          学习路线
        </h1>
        <p class="text-gray-600">
          循序渐进的学习计划，助你成为优秀的开发者
        </p>
      </div>

      <!-- 时间轴 -->
      <div class="max-w-4xl mx-auto relative">
        <!-- 时间轴线 -->
        <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>

        <!-- 时间节点 -->
        <div class="space-y-12">
          <!-- 大一上学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大一上学期
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Java基础学习 -->
              <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <i class="fab fa-java text-2xl text-indigo-600"></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900">Java基础</h3>
                </div>
                <p class="text-gray-600 mb-4">
                  跟随黑马程序员Java零基础视频教程，掌握Java基础知识
                </p>
                <a 
                  href="https://www.bilibili.com/video/BV17F411T7Ao" 
                  target="_blank"
                  class="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <span>观看教程</span>
                  <i class="fas fa-external-link-alt text-sm"></i>
                </a>
              </div>
              <!-- 算法学习 -->
              <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-code text-2xl text-green-600"></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900">算法基础</h3>
                </div>
                <p class="text-gray-600 mb-4">
                  同步刷题，建议从洛谷入门题目开始
                </p>
                <a 
                  href="https://www.luogu.com.cn" 
                  target="_blank"
                  class="text-green-600 hover:text-green-700 flex items-center space-x-1"
                >
                  <span>开始刷题</span>
                  <i class="fas fa-external-link-alt text-sm"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- 大一下学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-purple-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大一下学期
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-globe text-2xl text-blue-600"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Java Web开发</h3>
              </div>
              <p class="text-gray-600 mb-4">
                学习Spring、MyBatis等框架，完成完整的Web开发流程
              </p>
              <div class="space-y-2">
                <a 
                  href="https://www.bilibili.com/video/BV1m84y1w7Tb" 
                  target="_blank"
                  class="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>观看教程</span>
                  <i class="fas fa-external-link-alt text-sm"></i>
                </a>
                <div class="text-gray-500 text-sm">
                  <i class="fas fa-lightbulb text-yellow-500 mr-1"></i>
                  建议：完成教程后尝试独立开发一个项目
                </div>
              </div>
            </div>
          </div>

          <!-- 大二上学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-pink-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大二上学期
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-project-diagram text-2xl text-yellow-600"></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900">项目实践</h3>
                </div>
                <p class="text-gray-600 mb-4">
                  参与开源项目或知识星球项目，提升实战能力
                </p>
                <div class="text-gray-500 text-sm">
                  <i class="fas fa-check-circle text-green-500 mr-1"></i>
                  注重代码质量和项目架构
                </div>
              </div>
              <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-book text-2xl text-red-600"></i>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900">面试准备</h3>
                </div>
                <p class="text-gray-600 mb-4">
                  学习八股文知识，了解中间件，为实习面试做准备
                </p>
                <div class="space-y-2">
                  <a 
                    href="https://javaguide.cn/" 
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                  >
                    <i class="fas fa-book-reader"></i>
                    <span>JavaGuide 学习指南</span>
                  </a>
                  <div class="text-gray-500 text-sm">
                    <i class="fas fa-info-circle text-blue-500 mr-1"></i>
                    寒假可以尝试投递实习简历
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 大二下学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-green-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大二下学期
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-briefcase text-2xl text-purple-600"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">实习准备</h3>
              </div>
              <div class="space-y-4">
                <p class="text-gray-600">根据学历背景制定不同的实习策略：</p>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <i class="fas fa-check-circle text-green-500 mt-1"></i>
                    <span>985/211：直接投递大厂实习</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <i class="fas fa-check-circle text-green-500 mt-1"></i>
                    <span>双非院校：同时投递大厂和中小厂，争取在大三上前获得实习经验</span>
                  </li>
                </ul>
                <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div class="flex items-center space-x-2 text-blue-800">
                    <i class="fas fa-lightbulb"></i>
                    <span class="font-medium">实习建议</span>
                  </div>
                  <ul class="mt-2 space-y-2 text-blue-700">
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-sm mt-1"></i>
                      <span>准备充实的项目经验</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-sm mt-1"></i>
                      <span>持续刷题，保持手感</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-sm mt-1"></i>
                      <span>积极参与技术社区，建立个人影响力</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 大三上学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-blue-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大三上学期
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-building text-2xl text-blue-600"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">实习深度</h3>
              </div>
              <div class="space-y-4">
                <p class="text-gray-600">根据学校政策选择合适的实习时间：</p>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <i class="fas fa-check text-green-500 mt-1"></i>
                    <span>方案A：如学校允许，可直接进行长期实习（需要安排代课）</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <i class="fas fa-check text-green-500 mt-1"></i>
                    <span>方案B：如不允许利用寒假完成第一段实习</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 大三下学期 -->
          <div class="relative">
            <div class="flex items-center justify-center mb-4">
              <div class="bg-orange-600 text-white px-4 py-2 rounded-full font-medium z-10">
                大三下学期
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-rocket text-2xl text-orange-600"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">冲刺阶段</h3>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <p class="text-gray-600">暑期实习与秋招准备：</p>
                  <ul class="space-y-2 text-gray-600">
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-orange-500 mt-1"></i>
                      <span>凭借前期实习经验，冲刺更好的公司</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-orange-500 mt-1"></i>
                      <span>待遇满意可争取转正，否则为秋招累经验</span>
                    </li>
                    <li class="flex items-start space-x-2">
                      <i class="fas fa-arrow-right text-orange-500 mt-1"></i>
                      <span>9-10月秋招广投简历，全力冲刺理想企业</span>
                    </li>
                  </ul>
                </div>
                <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div class="flex items-center space-x-2 text-yellow-800">
                    <i class="fas fa-lightbulb"></i>
                    <span class="font-medium">备选方案</span>
                  </div>
                  <p class="text-yellow-700 mt-2">
                    如秋招结果不理想，可在大四上学期继续冲刺春招，把握最后机会
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 在时间轴右侧添加进度指示器 -->
    <div class="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4 hidden lg:block">
      <div v-for="(section, index) in sections" 
        :key="index"
        @click="scrollToSection(index)"
        class="w-3 h-3 rounded-full cursor-pointer transition-all duration-300"
        :class="[
          currentSection === index 
            ? 'bg-indigo-600 scale-125' 
            : 'bg-gray-300 hover:bg-indigo-400'
        ]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 定义部分常量
const sections = [
  { id: 'freshman-1', title: '大一上学期' },
  { id: 'freshman-2', title: '大一下学期' },
  { id: 'sophomore-1', title: '大二上学期' },
  { id: 'sophomore-2', title: '大二下学期' },
  { id: 'junior-1', title: '大三上学期' },
  { id: 'junior-2', title: '大三下学期' }
]

const currentSection = ref(0)

// 滚动到指定部分
const scrollToSection = (index: number) => {
  const elements = document.querySelectorAll('.relative')
  if (elements[index]) {
    elements[index].scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    })
  }
}

// 检测当前可见部分
const checkVisibleSection = () => {
  const elements = document.querySelectorAll('.relative')
  const windowHeight = window.innerHeight
  
  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    const elementCenter = rect.top + rect.height / 2
    
    if (elementCenter > 0 && elementCenter < windowHeight) {
      currentSection.value = index
    }
  })
}

// 添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', checkVisibleSection)
  checkVisibleSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkVisibleSection)
})
</script>

<style scoped>
/* 添加时间轴动画 */
.relative {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个时间节点添加延迟动画 */
.relative:nth-child(1) { animation-delay: 0.2s; }
.relative:nth-child(2) { animation-delay: 0.4s; }
.relative:nth-child(3) { animation-delay: 0.6s; }
.relative:nth-child(4) { animation-delay: 0.8s; }
.relative:nth-child(5) { animation-delay: 1s; }
.relative:nth-child(6) { animation-delay: 1.2s; }

/* 添加渐变背景动画 */
@keyframes gradient-x {
  0% { background-size: 200% 100%; background-position: left center; }
  100% { background-size: 200% 100%; background-position: right center; }
}

.animate-gradient-x {
  animation: gradient-x 3s linear infinite alternate;
}

/* 添加新的动画效果 */
/* 时间轴线动画 */
.from-indigo-500.to-purple-500 {
  background-size: 200% 200%;
  animation: gradient-flow 3s ease infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 添加卡片悬浮效果 */
.rounded-xl {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rounded-xl:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 20px -10px rgba(99, 102, 241, 0.3);
}

/* 添加图标动画 */
.w-10.h-10 i {
  transition: transform 0.3s ease;
}

.rounded-xl:hover .w-10.h-10 i {
  transform: scale(1.2);
}

/* 添加链接悬浮效果 */
a {
  position: relative;
  display: inline-flex;
  align-items: center;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 添加进度指示器动画 */
.fixed > div {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fixed > div:hover {
  transform: scale(1.5);
}

/* 添加内容淡入效果 */
.space-y-12 > div {
  opacity: 0;
  transform: translateY(20px);
  animation: content-fade-in 0.8s ease-out forwards;
}

@keyframes content-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个内容块添加不同的动画延迟 */
.space-y-12 > div:nth-child(1) { animation-delay: 0.2s; }
.space-y-12 > div:nth-child(2) { animation-delay: 0.4s; }
.space-y-12 > div:nth-child(3) { animation-delay: 0.6s; }
.space-y-12 > div:nth-child(4) { animation-delay: 0.8s; }
.space-y-12 > div:nth-child(5) { animation-delay: 1s; }
.space-y-12 > div:nth-child(6) { animation-delay: 1.2s; }
</style> 