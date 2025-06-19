// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { getUserRole, isAuthenticated } from '../utils/auth.js'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import CustomerDashboard from '../components/customer/CustomerDashboard.vue'
import AdminEquipmentDashboard from '../components/admin/AdminEquipmentDashboard.vue'
import AdminRequestDashboard from '../components/admin/AdminRequestDashboard.vue'

const routes = [
  // Pages publiques
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },

  // Pages admin
  {
    path: '/admin/equipments',
    component: AdminEquipmentDashboard,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated() && getUserRole() === 'admin') next()
      else next('/login')
    },
  },
  {
    path: '/admin/requests',
    component: AdminRequestDashboard,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated() && getUserRole() === 'admin') next()
      else next('/login')
    },
  },

  // Pages client
  {
    path: '/customer/dashboard',
    component: CustomerDashboard,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated() && getUserRole() === 'customer') next()
      else next('/login')
    },
  },

  {
    path: '/reset-password/{id}',
    component: CustomerDashboard,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) next()
      else next('/login')
    },
  },

  // Redirection par défaut
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
