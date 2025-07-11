<template>
  <el-row class="selects" data-testid="transactions-table-selects-row">
    <el-col :span="4">
      <DaySelect data-testid="transactions-table-day-select" />
    </el-col>
    <el-col :span="4">
      <WeekSelect data-testid="transactions-table-week-select" />
    </el-col>
    <el-col :span="4">
      <MonthSelect data-testid="transactions-table-month-select" />
    </el-col>
    <el-col :span="4">
      <YearSelect data-testid="transactions-table-year-select" />
    </el-col>
    <el-col :span="8">
      <MemoSelect data-testid="transactions-table-memo-select" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import MemoSelect from '@components/transactions/MemoSelect.vue'
import MonthSelect from '@components/transactions/MonthSelect.vue'
import WeekSelect from '@components/transactions/WeekSelect.vue'
import DaySelect from '@components/transactions/DaySelect.vue'
import YearSelect from '@components/transactions/YearSelect.vue'
</script>

<style scoped>
.selects {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
</style>