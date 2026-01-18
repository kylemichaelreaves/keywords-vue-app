<template>
  <SummaryHeader
    time-frame="Month"
    :selected-period="selectedMonth"
    :is-first="isFirstMonth"
    :is-last="isLastMonth"
    :go-to-next="goToNextMonth"
    :go-to-previous="goToPreviousMonth"
    :reset="resetSelectedMonth"
  >
    <template #amount-total>
      <MonthlyAmountDebitTotal data-testid="monthly-amount-debit-total" />
    </template>
  </SummaryHeader>
</template>

<script setup lang="ts">
import MonthlyAmountDebitTotal from '@components/transactions/summaries/month/MonthlyAmountDebitTotal.vue'
import SummaryHeader from '@components/shared/SummaryHeader.vue'

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
