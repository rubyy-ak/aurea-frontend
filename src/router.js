import { createRouter, createWebHistory } from 'vue-router'
import { session } from './auth'
import { setUnauthorizedHandler } from './api'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import ShelfView from './views/ShelfView.vue'
import PerfumeFormView from './views/PerfumeFormView.vue'
import PerfumeDetailView from './views/PerfumeDetailView.vue'
import StatsView from './views/StatsView.vue'

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/collection', name: 'collection', component: ShelfView, props: { status: 'OWNED' } },
  { path: '/wishlist', name: 'wishlist', component: ShelfView, props: { status: 'WISHLIST' } },
  { path: '/perfumes/new', name: 'perfume-new', component: PerfumeFormView },
  { path: '/perfumes/:id', name: 'perfume-detail', component: PerfumeDetailView, props: true },
  { path: '/perfumes/:id/edit', name: 'perfume-edit', component: PerfumeFormView, props: true },
  { path: '/stats', name: 'stats', component: StatsView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (!to.meta.public && !session.loggedIn) {
    return { name: 'login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : {} }
  }
  if (to.name === 'login' && session.loggedIn) return { name: 'home' }
})

setUnauthorizedHandler(() => router.push({ name: 'login' }))

export default router
