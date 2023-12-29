<template>
  <div id="app">
    <Navbar/>
    <router-view :key="route.path"/>
  </div>
</template>

<script lang="ts">
import Navbar from './components/Navbar.vue'
import {defineComponent} from "vue";
import {useRoute} from "vue-router";


export default defineComponent({
  name: 'App',
  components: {
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
  width: 100vw;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
