<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 标题 -->
    <div class="mb-12 text-center">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Java学习路线
      </h1>
      <p class="mt-2 text-gray-600">计算机专业四年学习规划</p>
    </div>

    <!-- 时间轴容器 -->
    <div class="relative">
      <!-- 中间时间轴线 -->
      <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-200 transform -translate-x-1/2"></div>

      <!-- 学年内容 -->
      <div class="space-y-24">
        <!-- 大一 -->
        <div class="relative">
          <!-- 学年标题 -->
          <div class="absolute left-1/2 -translate-x-1/2 -top-12 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">
            大一
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- 左侧内容 -->
            <div class="space-y-8">
              <!-- 第一学期 -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-indigo-800 mb-4">第一学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>Java语言基础</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>面向对象编程基础</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
                    <span>基础数据结构</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧内容 -->
            <div class="space-y-8">
              <!-- 第二学期 -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-purple-800 mb-4">第二学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>Java高级特性</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>数据结构进阶</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>算法基础</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 大二 -->
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 -top-12 bg-purple-600 text-white px-6 py-2 rounded-full font-bold">
            大二
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- 左侧内容 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-green-800 mb-4">第三学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>JavaWeb开发基础</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>MySQL数据库</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>Spring框架基础</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧内容 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-yellow-800 mb-4">第四学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>Spring Boot开发</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>MyBatis框架</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>项目实战训练</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 大三 -->
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 -top-12 bg-green-600 text-white px-6 py-2 rounded-full font-bold">
            大三
          </div>

          <div class="grid grid-cols-2 gap-8">
            <!-- 左侧内容 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-pink-800 mb-4">第五学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>分布式系统开发</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>微服务架构</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>高并发编程</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧内容 -->
            <div class="space-y-8">
              <div class="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <h3 class="text-lg font-bold text-cyan-800 mb-4">第六学期</h3>
                <div class="space-y-3">
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>企业级项目实战</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>性能优化</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <i class="far fa-circle text-gray-400 mr-2"></i>
                    <span>系统架构设计</span>
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
.container {
  max-width: 1200px;
}

/* 添加卡片悬浮效果 */
.rounded-xl {
  transition: all 0.3s ease;
}

.rounded-xl:hover {
  transform: translateY(-4px);
}

/* 添加渐变动画 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

/* 添加时间轴装饰点 */
.grid > div > div {
  position: relative;
}

.grid > div > div::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: currentColor;
  border-radius: 50%;
  top: 50%;
  opacity: 0.2;
}

.grid > div:first-child > div::before {
  right: -34px;
}

.grid > div:last-child > div::before {
  left: -34px;
}
</style>

<script setup lang="ts">
</script> 