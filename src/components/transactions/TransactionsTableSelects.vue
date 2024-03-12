<template>
  <el-row style="justify-content: space-evenly">
    <el-col :span="4">
      <DaySelect/>
    </el-col>
    <el-col :span="4">
      <WeekSelect/>
    </el-col>
    <el-col :span="4">
      <MonthSelect/>
    </el-col>
    <el-col :span="4">
      <YearSelect/>
    </el-col>
    <el-col :span="8">
      <MemoSelect/>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import MemoSelect from "@components/transactions/MemoSelect.vue";
import MonthSelect from "@components/transactions/MonthSelect.vue";
import WeekSelect from "@components/transactions/WeekSelect.vue";
import DaySelect from "@components/transactions/DaySelect.vue";
import YearSelect from "@components/transactions/YearSelect.vue";

export default defineComponent({
  name: "TransactionsTableSelects",
  components: {MemoSelect, YearSelect, MonthSelect, WeekSelect, DaySelect},
  setup() {
    return {};
  },
});

</script>

<style scoped>

</style>