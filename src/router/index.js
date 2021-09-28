import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/coordinator',
    component: () => import('@/views/Coordinator.vue')
  },
  {
    path: '/store',
    component: () => import('@/views/Store.vue')
  },
  {
    path: '/product',
    component: () => import('@/views/Product.vue')
  },
  {
    path: '/booked',
    component: () => import('@/views/Booked.vue')
  },
  {
    path: '/bookeddetail',
    component: () => import('@/views/BookedDetail.vue')
  },
  {
    path: '/reservationdetail',
    component: () => import('@/views/ReservationDetail.vue')
  },
  {
    path: '/wallet',
    component: () => import('@/views/Wallet.vue')
  },
  {
    path: '/information',
    component: () => import('@/views/Information.vue')
  },
  {
    path: '/storedetail',
    component: () => import('@/views/StoreDetail.vue')
  },
  {
    path: '/newproduct',
    component: () => import('@/views/NewProduct.vue')
  },
  {
    path: '/updateproduct',
    component: () => import('@/views/UpdateProduct.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/Profile.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
