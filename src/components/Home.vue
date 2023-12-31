<template>
  <h2>
    <el-icon style="vertical-align: top">
      <HomeFilled/>
    </el-icon>
    Home
  </h2>
  <p>In this demonstration of immense innovation and skill…</p>
  <p>I will be sketching out extremely sophisticated and mesmerizing UIs for my Lambdas and what they return.</p>
  <p>BudgetVisualizer will only work for me, since it is pulling records for a database behind a VPC</p>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {HomeFilled} from "@element-plus/icons-vue";

export default defineComponent({
  name: "Home",
  components: {HomeFilled},
  setup() {
    return {};
  }
})
</script>

<style scoped>

</style>