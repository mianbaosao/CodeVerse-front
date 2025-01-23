<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x mb-4">
          模拟面试
        </h1>
        <p class="text-gray-600">在真实场景中练习，提升面试技巧</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex gap-6">
        <!-- 左侧视频区域 - 恢复原来的大小 -->
        <div class="flex-1 bg-white rounded-xl shadow-lg p-6">
          <!-- 视频显示区域 -->
          <div class="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <!-- 未开始状态显示 -->
            <div v-if="!isCallStarted" 
              class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white"
            >
              <div class="mb-6 text-center">
                <h3 class="text-xl font-medium mb-2">准备开始面试</h3>
                <p class="text-gray-400 text-sm mb-4">点击按钮开始模拟面试</p>
                
                <button
                  @click="startCall"
                  class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  :disabled="loading"
                >
                  <i class="fas fa-video"></i>
                  <span>{{ loading ? '准备中...' : '开始面试' }}</span>
                </button>
              </div>
            </div>

            <!-- 视频显示 -->
            <template v-else>
              <!-- 对方视频 -->
              <video 
                ref="remoteVideo"
                class="w-full h-full object-cover"
                autoplay
                playsinline
              ></video>
              
              <!-- 本地视频（小窗口） -->
              <div class="absolute bottom-4 right-4 w-48 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <video
                  ref="localVideo"
                  class="w-full h-full object-cover mirror"
                  autoplay
                  playsinline
                  muted
                ></video>
              </div>

              <!-- 控制按钮 -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button 
                  @click="toggleAudio"
                  class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  :class="isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'"
                >
                  <i :class="['fas', isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash', 'text-white']"></i>
                </button>
                
                <button 
                  @click="toggleVideo"
                  class="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  :class="isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'"
                >
                  <i :class="['fas', isVideoEnabled ? 'fa-video' : 'fa-video-slash', 'text-white']"></i>
                </button>
                
                <button 
                  @click="endCall"
                  class="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                >
                  <i class="fas fa-phone-slash text-white"></i>
                </button>
              </div>

              <!-- 连接状态提示 -->
              <div 
                v-if="connectionStatus"
                class="absolute top-4 left-4 px-3 py-1 rounded-full text-sm"
                :class="connectionStatus.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'"
              >
                {{ connectionStatus.message }}
              </div>
            </template>
          </div>

          <!-- 面试信息 -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <i class="fas fa-user-tie text-indigo-600"></i>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">面试官: Mian Bao</h3>
                <p class="text-sm text-gray-500">高级后端开发工程师</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">面试时长</div>
              <div class="font-mono text-lg">{{ formatTime(timer) }}</div>
            </div>
          </div>
        </div>

        <!-- 右侧简历区域 -->
        <div class="w-[32rem] bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">简历管理</h2>
          
          <!-- 上传简历区域 - 仅在没有简历时显示 -->
          <div v-if="!resumeFile" class="mb-6">
            <div 
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept=".pdf,.doc,.docx"
                @change="handleFileChange"
              >
              <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">
                点击或拖拽文件到此处上传简历<br>
                支持 PDF、Word 格式
              </p>
            </div>
          </div>

          <!-- 简历预览 - 占据全部空间 -->
          <div v-if="resumeFile" class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                <div class="truncate">
                  <div class="font-medium text-gray-900">{{ resumeFile.name }}</div>
                  <div class="text-sm text-gray-500">{{ formatFileSize(resumeFile.size) }}</div>
                </div>
              </div>
              <button 
                @click="removeResume"
                class="text-gray-400 hover:text-red-500"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
            <!-- 预览区域占据剩余全部空间 -->
            <div class="h-[calc(100vh-20rem)] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                v-if="resumeUrl && resumeFile.type === 'application/pdf'"
                :src="resumeUrl"
                class="w-full h-full"
                frameborder="0"
              ></iframe>
              <div 
                v-else
                class="w-full h-full flex items-center justify-center text-gray-500"
              >
                <p>暂不支持预览该文件格式</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ConnectionStatus {
  type: 'success' | 'warning'
  message: string
}

// 类型定义
type Timer = ReturnType<typeof setInterval> | null

// 状态定义
const isCallStarted = ref(false)
const loading = ref(false)
const connectionStatus = ref<ConnectionStatus | null>(null)

// 视频相关
const localVideo = ref<HTMLVideoElement | null>(null)
const remoteVideo = ref<HTMLVideoElement | null>(null)
const isAudioEnabled = ref(true)
const isVideoEnabled = ref(true)
const timer = ref(0)
let timerInterval: Timer = null

// 简历相关
const fileInput = ref<HTMLInputElement | null>(null)
const resumeFile = ref<File | null>(null)
const resumeUrl = ref<string | null>(null)

// 添加更多类型定义
interface ResumeFile extends File {
  type: string
  size: number
  name: string
}

interface MediaError {
  name: string
  message: string
}

// 添加事件处理器类型
type FileChangeEvent = Event & { target: HTMLInputElement }
type FileDropEvent = DragEvent & { dataTransfer: DataTransfer }

// 添加更多类型定义
interface VideoStreamError extends Error {
  name: string
  message: string
}

interface VideoStreamOptions {
  video: boolean
  audio: boolean
}

// WebRTC 相关类型定义
interface PeerConnection extends RTCPeerConnection {
  addStream?: (stream: MediaStream) => void
}

interface WebRTCState {
  localStream: MediaStream | null
  peerConnection: PeerConnection | null
  dataChannel: RTCDataChannel | null
  offerSDP: string | null
  answerSDP: string | null
  iceCandidates: RTCIceCandidate[]
}

// WebRTC 状态
const webrtcState = ref<WebRTCState>({
  localStream: null,
  peerConnection: null,
  dataChannel: null,
  offerSDP: null,
  answerSDP: null,
  iceCandidates: []
})

// STUN/TURN 服务器配置
const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // 添加你的 TURN 服务器配置
  ]
}

// 初始化 WebRTC 连接
const initializePeerConnection = (): void => {
  const pc = new RTCPeerConnection(rtcConfig) as PeerConnection
  
  // 监听 ICE 候选
  pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      webrtcState.value.iceCandidates.push(event.candidate)
      // 发送 ICE 候选到远端
      sendIceCandidate(event.candidate)
    }
  }

  // 监听连接状态变化
  pc.onconnectionstatechange = () => {
    connectionStatus.value = {
      type: pc.connectionState === 'connected' ? 'success' : 'warning',
      message: getConnectionMessage(pc.connectionState)
    }
  }

  // 监听远程流
  pc.ontrack = (event: RTCTrackEvent) => {
    if (remoteVideo.value) {
      remoteVideo.value.srcObject = event.streams[0]
    }
  }

  webrtcState.value.peerConnection = pc
}

// 创建并发送 Offer
const createOffer = async (): Promise<void> => {
  const pc = webrtcState.value.peerConnection
  if (!pc) return

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    
    await pc.setLocalDescription(offer)
    webrtcState.value.offerSDP = offer.sdp || null
    
    // 发送 offer 到远端
    sendOffer(offer)
  } catch (error) {
    console.error('创建 offer 失败:', error)
    throw error
  }
}

// 处理接收到的 Answer
const handleAnswer = async (answer: RTCSessionDescriptionInit): Promise<void> => {
  const pc = webrtcState.value.peerConnection
  if (!pc) return

  try {
    await pc.setRemoteDescription(new RTCSessionDescription(answer))
    webrtcState.value.answerSDP = answer.sdp || null
  } catch (error) {
    console.error('设置远程描述失败:', error)
    throw error
  }
}

// 修改开始通话函数
const startCall = async (): Promise<void> => {
  loading.value = true
  try {
    // 获取本地媒体流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    
    if (localVideo.value) {
      localVideo.value.srcObject = stream
    }
    
    webrtcState.value.localStream = stream
    
    // 初始化 WebRTC 连接
    initializePeerConnection()
    
    // 添加本地流到连接
    const pc = webrtcState.value.peerConnection
    if (pc) {
      stream.getTracks().forEach(track => {
        if (pc && webrtcState.value.localStream) {
          pc.addTrack(track, webrtcState.value.localStream)
        }
      })
    }
    
    isCallStarted.value = true
    startTimer()
    
    connectionStatus.value = {
      type: 'success',
      message: '已连接'
    }
    
  } catch (error) {
    handleCallError(error)
  } finally {
    loading.value = false
  }
}

// 修改结束通话函数
const endCall = (): void => {
  const { peerConnection, localStream } = webrtcState.value
  
  // 停止所有媒体轨道
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
  }
  
  // 关闭 peer 连接
  if (peerConnection) {
    peerConnection.close()
  }
  
  // 清理视频元素
  if (localVideo.value) {
    localVideo.value.srcObject = null
  }
  if (remoteVideo.value) {
    remoteVideo.value.srcObject = null
  }
  
  // 重置状态
  webrtcState.value = {
    localStream: null,
    peerConnection: null,
    dataChannel: null,
    offerSDP: null,
    answerSDP: null,
    iceCandidates: []
  }
  
  isCallStarted.value = false
  timer.value = 0
  connectionStatus.value = null
  
  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

// 工具函数
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// WebRTC 相关函数
const getConnectionMessage = (state: RTCPeerConnectionState): string => {
  const messages: Record<string, string> = {
    'new': '准备连接',
    'connecting': '正在连接...',
    'connected': '已连接',
    'disconnected':  '连接断开',
    'failed': '连接失败',
    'closed': '连接已关闭'
  }
  return messages[state] || '未知状态'
}

const sendOffer = (offer: RTCSessionDescriptionInit): void => {
  // 实现发送 offer 到远端的逻辑
}

const sendAnswer = (answer: RTCSessionDescriptionInit): void => {
  // 实现发送 answer 到远端的逻辑
}

const sendIceCandidate = (candidate: RTCIceCandidate): void => {
  // 实现发送 ICE 候选到远端的逻辑
}

// 简历处理函数
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: FileChangeEvent): void => {
  const file = event.target.files?.[0]
  if (file) {
    handleResumeFile(file as ResumeFile)
  }
}

const handleFileDrop = (event: FileDropEvent): void => {
  const file = event.dataTransfer.files[0]
  if (file) {
    handleResumeFile(file as ResumeFile)
  }
}

const handleResumeFile = (file: ResumeFile): void => {
  // 检查文件类型
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    alert('只支持 PDF 和 Word 格式的文件')
    return
  }
  
  // 检查文件大小 (限制为 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    alert('文件大小不能超过 10MB')
    return
  }

  resumeFile.value = file
  resumeUrl.value = URL.createObjectURL(file)
}

const removeResume = () => {
  if (resumeUrl.value) {
    URL.revokeObjectURL(resumeUrl.value)
  }
  resumeFile.value = null
  resumeUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 添加音视频控制函数
const toggleAudio = (): void => {
  isAudioEnabled.value = !isAudioEnabled.value
  const stream = webrtcState.value.localStream
  if (stream) {
    stream.getAudioTracks().forEach(track => {
      track.enabled = isAudioEnabled.value
    })
  }
}

const toggleVideo = (): void => {
  isVideoEnabled.value = !isVideoEnabled.value
  const stream = webrtcState.value.localStream
  if (stream) {
    stream.getVideoTracks().forEach(track => {
      track.enabled = isVideoEnabled.value
    })
  }
}

// 添加错误处理函数
const handleCallError = (error: unknown): void => {
  const streamError = error as VideoStreamError
  console.error('开始通话失败:', streamError)
  
  const errorMessages: Record<string, string> = {
    NotAllowedError: '请允许访问摄像头和麦克风',
    NotFoundError: '未找到摄像头或麦克风设备',
    NotReadableError: '无法访问摄像头或麦克风',
    OverconstrainedError: '设备不满足要求',
    TypeError: '参数错误'
  }
  
  connectionStatus.value = {
    type: 'warning',
    message: errorMessages[streamError.name] || '连接失败'
  }
}

// 添加计时器函数
const startTimer = (): void => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      timer.value++
    }, 1000)
  }
}

// 生命周期钩子
onMounted(() => {
  // 移除自动启动视频流和计时器的逻辑
  // 现在只有在点击"开始面试"按钮后才会启动
})

onUnmounted(() => {
  endCall()
})
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
}

/* 添加一些过渡动画 */
.transition-colors {
  transition: all 0.3s ease;
}

/* 添加拖放区域的动画效果 */
.border-dashed {
  transition: all 0.3s ease;
}

.border-dashed:hover {
  background-color: rgba(99, 102, 241, 0.05);
}

/* 添加输入框样式 */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

/* 添加加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}
</style>