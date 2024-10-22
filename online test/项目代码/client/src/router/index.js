import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'login',
    component: require("../views/login.vue").default
  },
  {
    path: '/answer',
    name: 'answer',
    component: require("../views/pages/answer.vue").default
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
