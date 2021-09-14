import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseURL
  // timeout
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: (store.state as any).user.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = (store.state as any).user
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
let isRefreshing = false // 控制刷新token的状态
let requests: any[] = [] // 存储刷新token期间过来的401请求
request.interceptors.response.use(function (response) {
  // http 状态码 2xx 执行这里
  return response
}, async function (error) {
  // http 状态码超出 2xx 执行这里

  if (error.response) { // 请求发出去了，收到了响应，但是状态码超出了 2xx
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误！')
    } else if (status === 401) {
      const { user } = (store.state as any).user
      if (!user) {
        redirectLogin()
        return Promise.reject(error)
      }

      // 尝试获取新的 token
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 token 失败')
          }

          store.commit('user/setUser', res.data.content)
          // 把 requests 队列中的请求发出去
          requests.forEach(cb => cb())
          requests = []
          // 本次失败的请求重新发送出去
          return request(error.config)
        })
          .catch(err => {
            console.log(err)
            store.commit('user/setUser', null)
            redirectLogin()
            return Promise.reject(error)
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      // 刷新 token 期间，把请求挂起放在 requests 数组里
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员！')
    } else if (status === 404) {
      Message.error('请求资源不存在！')
    } else if (status >= 500) {
      Message.error('服务器内部错误，请联系管理员！')
    }
  } else if (error.request) { // 请求发出去了，没有收到响应
    Message.error('请求超时，请刷新重试！')
  } else { // 请求时发生了错误
    Message.error(`请求失败：${error.message}`)
  }
  return Promise.reject(error)
})

export default request
