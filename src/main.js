import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss'

// 1. 建议将 deep-chat 的引入放在 Vue 挂载前即可
import 'deep-chat'

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang'
import './icons'
import './permission'
import './utils/error-log'

import * as filters from './filters'

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 2. 关键配置：确保 Vue 忽略自定义 Web Component 标签
// 你使用的正则 [/^deep-/] 是正确的，能匹配 <deep-chat>
Vue.config.ignoredElements = [/^deep-/]

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
