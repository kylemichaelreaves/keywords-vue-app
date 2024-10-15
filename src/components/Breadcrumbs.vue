<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <router-link class="router-class" :to="breadcrumb.to">{{ breadcrumb.label }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import {reactive, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import type {Breadcrumb} from "@types";

const breadcrumbs = reactive<Breadcrumb[]>([]);
const route = useRoute();
const router = useRouter();

const routes = router.options.routes;

watch(
    () => [route.name, route.params],
    () => {
      generateBreadcrumbs(route);
    },
    {immediate: true}
);

// Generate breadcrumbs based on the current route
function generateBreadcrumbs(route: RouteRecordRaw) {
  breadcrumbs.length = 0;

  const matchedRoutes = findRouteChain(routes, String(route.name));

  if (matchedRoutes) {
    matchedRoutes.forEach((r, index) => {
      // If it's a parent route like transactions, assign the correct path
      let routePath = r.path;

      // If the route is a parent route (like transactions) with children, don't pass it as part of a child route
      if (r.children && index === matchedRoutes.length - 1) {
        routePath = r.path;
      }

      breadcrumbs.push({
        label: String(r.name) || r.path,
        to: routePath
      });
    });
  }
}

// Find the route chain based on the current route name
function findRouteChain(routes: RouteRecordRaw[], currentRouteName: string | undefined): RouteRecordRaw[] | null {
  for (const route of routes) {
    if (route.name === currentRouteName) {
      return [route];
    }

    if (route.children) {
      const childChain = findRouteChain(route.children, currentRouteName);
      if (childChain) {
        return [route, ...childChain];
      }
    }
  }
  return null;
}
</script>

<style scoped>
.router-class {
  color: #ffffff;
}
</style>
