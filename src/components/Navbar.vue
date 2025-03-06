<template>
  <!--  TODO add log-in, user, log-out functionality and corresponding style to keep the div on the rightside of the window-->
  <div class='navbar-container'>
    <el-tabs :active-index="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="(route, index) in routes" :key="index" :label="String(index)" :name="index">
        <template v-slot:label>
        <span class="custom-tabs-label">
          <el-icon style="vertical-align: middle" size="1.5em">
            <component :is="routeIcon(route).value" />
          </el-icon>
          <span>{{ String(route.name) }}</span>
        </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- Login/Logout Tab Pane -->
    <el-tabs>
      <el-tab-pane class="login-control" label="login-control" name="login-control">
        <template v-slot:label>
                <span @click.stop="handleLoginLogout">
                  <!--  TODO instead of el-icon, use el-avatar with an icon -->
                  <el-icon style="vertical-align: middle" size="1.5em">
                    <component :is="authStore.isUserAuthenticated ? 'UserFilled' : 'User'" />
                  </el-icon>
                  <span>{{ authStore.isUserAuthenticated ? authStore.user.username : 'Log In' }}</span>
                  <el-tag
                    v-if="authStore.isUserAuthenticated && authStore.user.role === 'admin'"
                    class="flex-grow"
                    type="danger"
                    size="small"
                    :round="true"
                    effect="dark"
                  >
                    {{ authStore.user.role }}
                  </el-tag>
                </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { TabsPaneContext, ElTabs, ElTabPane } from 'element-plus'
import { useAuthStore } from '@stores/auth'
import AuthService from '../services/auth.service.ts'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const excludedRoutes = ['not-found', 'login', 'register']
const routes = router.options.routes.filter(r => !excludedRoutes.includes(r.name as string))

const activeTab = ref(0)

routes.forEach((r, index) => {
  if (r.path === route.path) {
    activeTab.value = index
  }
})

router.afterEach((to) => {
  const tabIndex = routes.findIndex(route => route.path === to.path)
  if (tabIndex !== -1 && activeTab.value !== tabIndex) {
    activeTab.value = tabIndex
  }
})


const routeIcon = (route: RouteRecordRaw) => computed(() => {
  switch (route.name) {
    case 'home':
      return 'HomeFilled'
    case 'address-geocoder':
      return 'LocationFilled'
    case 'keywords':
      return 'Key'
    case 'budget-visualizer':
      return 'TrendCharts'
    default:
      return 'InformationFilled'
  }
})

async function handleClick(tab: TabsPaneContext) {
  const tabIndex = Number(tab.index)
  if (!isNaN(tabIndex)) {
    try {
      await router.push({ path: routes[tabIndex].path })
      if (activeTab.value !== tabIndex) {
        activeTab.value = tabIndex
      }
    } catch (error) {
      console.error('Failed to navigate to route:', error)
    }
  } else {
    console.error('Invalid tab index:', tab.index)
  }
}

async function handleLoginLogout() {
  if (authStore.isUserAuthenticated) {
    AuthService.logout()
    await router.push({ path: '/' })
  } else {
    await router.push({ path: '/login' })
  }
}


</script>


<style scoped>
.navbar-container {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F5F7FA;
  border-bottom: 7px solid #409EFF;
}

.login-control {
  cursor: pointer;
  align-items: end;
  justify-content: end;
  display: flex;
  flex-direction: row;
}

.flex-grow {
  flex-grow: 1;
}

.login-icon, .logout-icon {
  color: #409EFF; /* Element UI primary color for consistency */
}

.custom-tabs-label {
  display: flex;
  align-items: center;
}

.custom-tabs-label el-icon {
  margin-right: 0.5em;
}

.custom-tabs-label span {
  font-size: 1.2em;
}
</style>