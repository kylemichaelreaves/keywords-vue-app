<template>
  <el-tabs :active-index="activeTab" @tab-click="handleClick">
    <el-tab-pane v-for="(route, index) in routes" :key="index" :label="String(index)" :name="index">
      <template v-slot:label>
        <span class="custom-tabs-label">
          <el-icon style="vertical-align: middle">
            <component :is="routeIcon(route).value"/>
          </el-icon>
          <span>{{ " " + String(route.name) }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import type {RouteRecordRaw} from "vue-router";
import type { TabsPaneContext } from 'element-plus'

export default defineComponent(
    {
      name: "Navbar",
      setup() {
        const router = useRouter();
        const route = useRoute();
        const routes = router.options.routes.filter(r => r.name !== 'not-found');
        const activeTab = ref(0);

        routes.forEach((r, index) => {
          if (r.path === route.path) {
            activeTab.value = index;
          }
        });

        router.afterEach((to) => {
          const tabIndex = routes.findIndex(route => route.path === to.path);
          if (tabIndex !== -1 && activeTab.value !== tabIndex) {
            activeTab.value = tabIndex;
          }
        });


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
          const tabIndex = Number(tab.index);
          if (!isNaN(tabIndex)) {
            try {
              await router.push({path: routes[tabIndex].path});
              if (activeTab.value !== tabIndex) {
                activeTab.value = tabIndex;
              }
            } catch (error) {
              console.error('Failed to navigate to route:', error);
            }
          } else {
            console.error('Invalid tab index:', tab.index);
          }
        }

        return {routes, route, activeTab, handleClick, routeIcon};


      }
    });


</script>

<style scoped>
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