// @ts-nocheck
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

// 路由表
const routes = [
  { // 登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    meta: { requireAuth: false } // 添加额外的自定义数据
  },
  { // 底部标签栏
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      { // 首页
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requireAuth: false }
      },
      { // 问答
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requireAuth: false }
      },
      { // 视频
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requireAuth: false }
      },
      { // 我的
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requireAuth: false }
      }
    ]
  },
  { // 搜索
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requireAuth: false }
  },
  { // 文章详情
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    props: true,
    meta: { requireAuth: false }
  },
  { // 用户资料
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile/'),
    meta: { requireAuth: false }
  },
  { // 小智同学
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat/'),
    meta: { requireAuth: true }
  },
  { // 用户关注、粉丝
    path: '/user/:userId/follow',
    name: 'user-follow',
    component: () => import('@/views/user-follow/'),
    props: true,
    meta: { requireAuth: true }
  },
  { // 我的收藏、历史
    path: '/my-article/:type?',
    name: 'my-article',
    component: () => import('@/views/my-article/'),
    props: true,
    meta: { requireAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 校验登录状态
    if (store.state.user) {
      // 已登录直接放行
      return next()
    }
    // 未登录，提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登陆吗'
    }).then(() => {
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }).catch(() => {
      // 取消中断路由导航
      next(false)
    })
  } else {
    // 不需要登录即可访问，直接放行
    next()
  }
})

export default router
