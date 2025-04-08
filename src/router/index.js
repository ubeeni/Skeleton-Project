import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/homePage/HomePage.vue'
import NotFoundPage from '@/pages/notFoundPage/NotFoundPage.vue'

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
      path: '/user/:id/edit',
      name: 'userEdit',
      component: () => import('@/pages/userPage/UserEditPage.vue'),
    },
    {
      path: '/user/:id/settings',
      name: 'userSetting',
      component: () => import('@/pages/userPage/UserSettingPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFoundPage,
    },
  ],

  // 페이지 이동시 항상 최상단으로 이동
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
