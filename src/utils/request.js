/*
    请求模块
*/

import axios from 'axios'

import JSONbig from 'json-bigint'

import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  transformResponse: [ function(data) {
    try {
      // 转换成功将结果返回
      return JSONbig.parse(data)
    } catch (error) {
      // 转换失败直接返回
      // console.log('转换失败', error)
      return data
    }
  } ]
})

// 请求拦截器
request.interceptors.request.use(function(config) {
  const { user } = store.state
  // 如果用户已登录，统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 处理完之后一定要把 config 返回，否则请求就会停在这里
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 响应拦截器

export default request
