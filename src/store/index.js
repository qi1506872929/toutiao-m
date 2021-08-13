import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY),
    cachePages: [ 'LayoutIndex' ]
  },
  mutations: {
    SETUSER(state, data) {
      state.user = data
      setItem(USER_KEY, state.user)
    },
    // 添加缓存页面
    ADDCACHEPAGE(state, namePage) {
      if (!state.cachePages.includes(namePage)) {
        state.cachePages.push(namePage)
      }
    },
    // 移除缓存页面
    DELETECACHEPAGE(state, namePage) {
      const index = state.cachePages.indexOf(namePage)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
