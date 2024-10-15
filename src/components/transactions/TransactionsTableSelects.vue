<template>
  <el-row class="selects">
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

<script setup lang="ts">
import MemoSelect from "@components/transactions/MemoSelect.vue";
import MonthSelect from "@components/transactions/MonthSelect.vue";
import WeekSelect from "@components/transactions/WeekSelect.vue";
import DaySelect from "@components/transactions/DaySelect.vue";
import YearSelect from "@components/transactions/YearSelect.vue";
</script>

<style scoped>
.selects {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
</style>