<template>
  <div id="app">
    <Navbar/>
    <Breadcrumbs/>
    <router-view :key="route.path"/>
  </div>
</template>

<script lang="ts">
import Navbar from './components/Navbar.vue'
import {defineComponent} from "vue";
import {useRoute} from "vue-router";
import Breadcrumbs from "@components/Breadcrumbs.vue";


export default defineComponent({
  name: 'App',
  components: {
    Breadcrumbs,
    Navbar,
  },
  setup() {
    const route = useRoute();
    return {route};
  }
})
</script>


<style scoped>
#app {
  width: 95vw;
}
</style>
