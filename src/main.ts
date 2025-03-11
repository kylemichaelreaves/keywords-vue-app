import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import VueTippy from 'vue-tippy'
import { useAuthStore } from '@stores/auth.ts'
import { router } from '@router'

const app = createApp(App)

const pinia = createPinia()

app
  .use(router)
  .use(VueQueryPlugin)
  .use(pinia)
  .use(ElementPlus)
  .use(VueTippy)
  .mount('#app')


// navigation guard: only authenticated users can access auth routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.getIsUserAuthenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

// listen to beforeUnload event so we can clear local storage and the store
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  // clear the store
  const authStore = useAuthStore()
  authStore.setUser({
    id: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'guest'
  })
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

