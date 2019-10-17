import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Login from './components/Login.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to)
  const token = localStorage.getItem('token')
  // 如果是登录或者有token 就放行  否则前往登录页面
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
