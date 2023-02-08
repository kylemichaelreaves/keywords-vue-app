<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <TrendCharts/>
    </el-icon>
    Budget Visualizer
  </h2>
  <p>This component will do many things, including:</p>
  <!-- display a list of things this component should do in a list  -->
  <ToDoList :initialTodos="toDoList"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ToDoList from "./ToDoList.vue";
import {useQuery} from "@tanstack/vue-query";
import axios, {AxiosError} from "axios";
import {API_GATEWAY_URL} from "../constants";

const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    ToDoList
  },
  // TODO: add to the toDoList structure subtasks for each of the items
  setup() {
    const toDoList = [
      {text: 'Load the csv from AWS S3', done: false},
      {text: 'Display a piechart of the budget', done: false},
      {text: 'Display a bar chart of the budget', done: false},
      {text: 'Display a line chart of the budget', done: false},
      {text: 'Toggle between monthly, yearly, and all time', done: false},
    ]

    const {data, error, isLoading} = useQuery({
      queryKey: ['transactions'],
      queryFn: async () => await axios.get(
          `${API_GATEWAY_URL}/transactions`
      ).then(res => res.data),
    })

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