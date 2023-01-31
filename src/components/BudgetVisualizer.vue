<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <TrendCharts/>
    </el-icon>
    Budget Visualizer
  </h2>
  <p>This component will do many things, including:</p>
  <!-- display a list of things this component should do in a list  -->
  <el-card class="box-card">
    <ul v-for="item in toDoList" :key="item">
      <li>{{ item }}</li>
    </ul>
  </el-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";

const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer.vue",
  setup() {
    const toDoList: Array<string> = [
      'Load the csv from AWS S3',
      'Display a piechart of the budget',
      'Display a bar chart of the budget',
      'Display a line chart of the budget',
      'Toggle between monthly, yearly, and all time',
    ]
    return {toDoList};
  }
})
export default BudgetVisualizer;
</script>

<style scoped>
.box-card {
  width: 100%;
  background: #f2f2f2;
  position: center;
}

</style>