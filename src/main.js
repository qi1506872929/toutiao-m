import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import router from './router'
import store from './store'

import '@/utils/dayjs'

// 加载 Vant 组件和 样式库
import Vant from 'vant'
import 'vant/lib/index.css'

// 动态设置 REM 基准值（html 标签的字体大小）
import 'amfe-flexible'

// 加载全局样式(最好放在最后，方便覆盖第三方样式)
import './styles/index.less'

// 全局注册 Vant 中的组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
