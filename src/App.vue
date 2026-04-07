<template>
  <div class="app-root">
    <Navbar />
    <Breadcrumbs v-if="!isBudgetVisualizerSection" />
    <router-view :key="route.path" />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@components/Navbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '@components/Breadcrumbs.vue'

const route = useRoute()
const isBudgetVisualizerSection = computed(() => route.path.startsWith('/budget-visualizer'))
</script>

<style scoped>
.app-root {
  width: 100vw;
}
</style>
