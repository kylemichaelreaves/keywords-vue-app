<template>
  <div>
    <h1>Not Found</h1>
    <el-button @click="goBack">Go Back</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
// TODO add a back button
export default defineComponent({
  name: 'NotFound',
  components: {},
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    }

    return {goBack}
  }
})

</script>

<style scoped>
  h1 {
    color: red;
  }
</style>