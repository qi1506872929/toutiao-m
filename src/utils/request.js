/*
    请求模块
*/

import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'

import store from '@/store'
import router from '@/router'

const refreshTokenReq = axios.create({
  baseUrl: 'http://ttapi.research.itcast.cn/' // 基础路径
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  transformResponse: [
    function(data) {
      try {
        // 转换成功将结果返回
        return JSONbig.parse(data)
      } catch (error) {
        // 转换失败直接返回
        // console.log('转换失败', error)
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    const { user } = store.state
    // 如果用户已登录，统一给接口设置 token 信息
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 处理完之后一定要把 config 返回，否则请求就会停在这里
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  function(response) {
    // 响应成功进入这里
    return response
  },
  async function(error) {
    // 请求响应失败进入这里，超过 2XX 的状态码都坏进入这里
    const status = error.response.status
    if (status === 400) {
      // 客户端请求参数异常
      Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
      // token 无效
      // 如果没有 user 或 user.token，直接去登录
      const { user } = store.state
      if (!user || !user.token) {
        return redirectLogin()
      }
      // 使用 refresh_token 请求获取新的 token
      try {
        const { data } = await refreshTokenReq({
          method: 'PUT',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        console.log(data)
        // 拿到新的 token 之后把它更新到容器中
        user.toke = data.data.token
        store.commit('SETUSER', user)
        // 把失败的请求重新发出去
        // error.config 是本次请求的相关配置对象
        return request(error.config)
      } catch (error) {
        // 刷新失败直接跳转登录页
        Toast('登录过期，请重新登陆')
        redirectLogin()
      }
    } else if (status === 403) {
      // 没有权限操作
      Toast.fail('没有权限操作')
    } else if (status >= 500) {
      // 服务端异常
      Toast.fail('服务端异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)

function redirectLogin() {
  router.replace({
    name: 'login',
    query: {
      // 获取当前的物理路径
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
