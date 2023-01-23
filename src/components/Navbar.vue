<template>
  <el-tabs :active-index="activeTab" @tab-click="handleClick">
    <el-tab-pane v-for="(route, index) in routes" :key="index">
      <template v-slot:label>
        <span class="custom-tabs-label">
          <el-icon style="vertical-align: middle">
            <component :is="routeIcon(route).value"/>
          </el-icon>
          <span>{{" " + route.name}}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {RouteRecordRaw, useRoute, useRouter} from "vue-router";

const Navbar = defineComponent({
  name: "Navbar",
  setup() {
    const router = useRouter();
    const routes = router.options.routes;
    const activeTab = ref(0);
    const route = useRoute();

    routes.forEach((r, index) => {
      if (r.path === route.path) {
        activeTab.value = index;
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
        default:
          return ''
      }
    })

    function handleClick(tab: { index: number }, event: Event) {
      router.push({path: routes[tab.index].path});
      activeTab.value = tab.index;
    }
    return {routes, route, activeTab, handleClick, routeIcon};
  }
});

export default Navbar;
</script>

<style scoped>
</style>