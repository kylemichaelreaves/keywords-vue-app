<template>
  <div
    class="card-header"
    data-testid="month-summary-table-header"
    :data-selected-month="selectedMonth"
  >
    <div class="summary-left" data-testid="month-summary-left-section">
      <h2 data-testid="month-summary-title">Month Summary for: {{ selectedMonth }}</h2>
      <MonthlyAmountDebitTotal data-testid="monthly-amount-debit-total" />
    </div>
    <NavigationButtonGroup
      label="Month"
      :is-last="isLastMonth"
      :is-first="isFirstMonth"
      :go-to-next="goToNextMonth"
      :go-to-previous="goToPreviousMonth"
      :reset="resetSelectedMonth"
      data-testid="month-summary-navigation-button-group"
    />
  </div>
</template>

<script setup lang="ts">
import MonthlyAmountDebitTotal from '@components/transactions/MonthlyAmountDebitTotal.vue'
import NavigationButtonGroup from '@components/shared/NavigationButtonGroup.vue'

interface Props {
  selectedMonth: string
  isLastMonth: boolean
  isFirstMonth: boolean
  goToNextMonth: () => void
  goToPreviousMonth: () => void
  resetSelectedMonth: () => void
}

defineProps<Props>()
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
</style>
