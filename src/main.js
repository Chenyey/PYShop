import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import moment from 'moment'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/style.scss'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueQuillEditor /* { default global options } */)
// 设置axios的默认配置
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/yeye'
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // console.log(response.meta)
  if (response.meta.status === 401) {
    response.meta.msg = '登录信息过期，请重新登录'
    localStorage.removeItem('token')
    router.push({ name: 'login' })
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

Vue.filter('toTime', (value) => {
  // console.log(value)
  value = value + '000'
  return moment().format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
