<template>
  <el-row class="selects" :data-testid="props.dataTestId">
    <el-col
      v-for="select in selects"
      :key="select.testId"
      :span="select.span"
    >
      <component :is="select.component" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import MemoSelect from '@components/transactions/MemoSelect.vue'
import MonthSelect from '@components/transactions/MonthSelect.vue'
import WeekSelect from '@components/transactions/WeekSelect.vue'
import DaySelect from '@components/transactions/DaySelect.vue'
import YearSelect from '@components/transactions/YearSelect.vue'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-selects-row'
  }
})

const selects = [
  {
    component: DaySelect,
    span: 4,
    testId: 'transactions-table-day-select'
  },
  {
    component: WeekSelect,
    span: 4,
    testId: 'transactions-table-week-select'
  },
  {
    component: MonthSelect,
    span: 4,
    testId: 'transactions-table-month-select'
  },
  {
    component: YearSelect,
    span: 4,
    testId: 'transactions-table-year-select'
  },
  {
    component: MemoSelect,
    span: 8,
    testId: 'transactions-table-memo-select'
  }
]
</script>

<style scoped>
.selects {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
</style>