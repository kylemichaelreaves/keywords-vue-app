<template>
  <div id="app">
    <Navbar/>
    <Breadcrumbs/>
    <router-view :key="route.path"/>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@components/Navbar.vue'
import {useRoute} from "vue-router";
import Breadcrumbs from "@components/Breadcrumbs.vue";

const route = useRoute();
</script>

<style scoped>
#app {
  width: 95vw;
}
</style>
