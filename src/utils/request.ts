interface RequestOptions extends RequestInit {
  needAuth?: boolean
}

const request = {
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { needAuth = true, ...restOptions } = options
    
    // 添加标准请求头
    const headers = new Headers({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': navigator.userAgent,
      ...restOptions.headers
    })

    // 如果需要认证，添加认证信息
    if (needAuth) {
      const loginId = localStorage.getItem('loginId')
      const tokenValue = localStorage.getItem('tokenValue')
      if (loginId && tokenValue) {
        headers.append('LoginId', loginId)
        headers.append('Satoken', 'mianbao ' + tokenValue)
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      method: 'GET',
      headers,
      credentials: 'include',
      mode: 'cors'
    })
    return response.json()
  },

  async post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    const { needAuth = true, ...restOptions } = options
    
    // 添加标准请求头
    const headers = new Headers({
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': navigator.userAgent,
      ...restOptions.headers
    })

    // 如果需要认证，添加认证信息
    if (needAuth) {
      const loginId = localStorage.getItem('loginId')
      const tokenValue = localStorage.getItem('tokenValue')
      if (loginId && tokenValue) {
        headers.append('LoginId', loginId)
        headers.append('Satoken', 'mianbao ' + tokenValue)
        // 调试信息
        console.log('Request Headers:', {
          LoginId: loginId,
          Satoken: 'mianbao ' + tokenValue
        })
      } else {
        console.warn('Missing auth info:', { loginId, tokenValue })
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'cors'
    })
    return response.json()
  }
}

export default request 