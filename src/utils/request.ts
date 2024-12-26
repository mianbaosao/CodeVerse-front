interface RequestOptions extends RequestInit {
  needAuth?: boolean
}

interface UserAuthInfo {
  isLogin: boolean
  loginId: string
  tokenValue: string
  [key: string]: any
}

// 定义请求头接口
interface BaseHeaders {
  'Content-Type': string
  'loginId'?: string
  'Satoken'?: string
  [key: string]: string | undefined
}

// 获取用户认证信息
const getUserAuthInfo = (): UserAuthInfo | null => {
  const authInfo = localStorage.getItem('userAuthInfo')
  return authInfo ? JSON.parse(authInfo) : null
}

const request = {
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { needAuth = true, ...restOptions } = options
    
    // 从 userAuthInfo 获取 loginId
    const authInfo = getUserAuthInfo()
    const loginId = authInfo?.loginId
    
    // 创建基础请求头
    const baseHeaders: BaseHeaders = {
      'Content-Type': 'application/json',
      ...(loginId && { 'loginId': loginId }), // 如果有 loginId 就添加到请求头
      ...restOptions.headers
    }

    // 如果需要认证，添加认证信息
    if (needAuth && authInfo) {
      const { tokenValue } = authInfo
      if (loginId && tokenValue) {
        baseHeaders['Satoken'] = 'mianbao ' + tokenValue
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      method: 'GET',
      headers: baseHeaders,
      credentials: 'include',
      mode: 'cors'
    })
    return response.json()
  },

  async post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { needAuth = true, ...restOptions } = options
    
    // 从 userAuthInfo 获取 loginId
    const authInfo = getUserAuthInfo()
    const loginId = authInfo?.loginId
    
    // 创建基础请求头
    const baseHeaders: BaseHeaders = {
      'Content-Type': 'application/json',
      ...(loginId && { 'loginId': loginId }), // 如果有 loginId 就添加到请求头
      ...restOptions.headers
    }

    // 如果需要认证，添加认证信息
    if (needAuth && authInfo) {
      const { tokenValue } = authInfo
      if (loginId && tokenValue) {
        baseHeaders['Satoken'] = 'mianbao ' + tokenValue
        // 调试信息
        console.log('Request Headers:', baseHeaders)
      } else {
        console.warn('Missing auth info:', { loginId, tokenValue })
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'cors'
    })
    return response.json()
  }
}

export default request 