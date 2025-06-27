<template>
  <el-card>
    <template #header>
      <div class="header-container">
        <h3>{{ props.budgetCategoryName }} Summary for {{ props.date }} ({{ props.timeFrame }})</h3>
<!--        <BudgetCategoryAmountDebitStatistic-->
<!--          :budgetCategoryName="props.budgetCategoryName"-->
<!--          :date="props.date"-->
<!--          :timeFrame="props.timeFrame"-->
<!--        />-->
      </div>
    </template>
<!--    <BudgetCategoryHistoricalLineChart-->
<!--      :budgetCategoryName="props.budgetCategoryName"-->
<!--      :date="props.date"-->
<!--      :timeFrame="props.timeFrame"-->
<!--    />-->
  </el-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import BudgetCategoryAmountDebitStatistic from '@components/transactions/BudgetCategoryAmountDebitStatistic.vue'
import BudgetCategoryHistoricalLineChart from '@components/transactions/BudgetCategoryHistoricalLineChart.vue'

const props = defineProps({
  budgetCategoryName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timeFrame: {
    type: String,
    required: true
  }
})

</script>


<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>