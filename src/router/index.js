import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/homePage/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/detail',
      name: 'add',
      component: () => import('@/pages/detailPage/DetailPage.vue'),
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/pages/detailPage/DetailPage.vue'),
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('@/pages/listPage/ListPage.vue'),
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/pages/reportPage/ReportPage.vue'),
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('@/pages/userPage/UserPage.vue'),
    },
    {
      path: '/paths(.*)',
      name: 'notfound',
      component: () => import('@/pages/notFoundPage/NotFoundPage.vue'),
    },
  ],
})

export default router
