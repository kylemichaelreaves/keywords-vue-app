import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia, type Pinia } from 'pinia'
import './style.css'
import App from './App.vue'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import VueTippy from 'vue-tippy'
import { useAuthStore } from '@stores/auth.ts'
import { useThemeStore } from '@stores/theme.ts'
import { router } from '@router'
import { queryClient } from '@api/queryClient.ts'

// Extend globalThis interface for Playwright testing
interface GlobalWithPinia {
  __PINIA__?: Pinia
}

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)

const user = localStorage.getItem('user')
const token = localStorage.getItem('token')

if (user && token && user !== 'undefined') {
  try {
    const authStore = useAuthStore()
    authStore.setUser(JSON.parse(user))
    authStore.setToken(token)
    authStore.setIsUserAuthenticated(true)
  } catch (error) {
    console.error('Failed to parse user data:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}

// Initialize theme after pinia is set up
const themeStore = useThemeStore()
themeStore.initializeTheme()

app.use(router).use(VueQueryPlugin, { queryClient }).use(VueTippy)

// NAV GUARD!!! only authenticated users can access auth routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.getIsUserAuthenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

// Expose pinia to globalThis for Playwright testing
// Expose in all environments except when explicitly disabled
// This enables E2E testing in preview builds while still allowing
// production builds to disable it if needed
if (import.meta.env.VITE_DISABLE_PINIA_TESTING !== 'true') {
  ;(globalThis as GlobalWithPinia).__PINIA__ = pinia
}
