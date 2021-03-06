import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router