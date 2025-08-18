<template>
  <SummaryHeader
    time-frame="Week"
    :selected-period="selectedWeek"
    :is-first="isFirstWeek"
    :is-last="isLastWeek"
    :go-to-next="goToNextWeek"
    :go-to-previous="goToPreviousWeek"
    :reset="resetSelectedWeek"
    data-testid="week-summary-header"
  >
    <template #subtitle>
      <el-text size="default">From: {{ weekRange.startDate }} To: {{ weekRange.endDate }}</el-text>
    </template>
    <template #amount-total>
      <WeeklyAmountDebitTotal data-testid="weekly-amount-debit-total" />
    </template>
  </SummaryHeader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElText } from 'element-plus'
import WeeklyAmountDebitTotal from './WeeklyAmountDebitTotal.vue'
import SummaryHeader from '@components/shared/SummaryHeader.vue'
import { getWeekRange } from '@api/helpers/getWeekRange'

interface Props {
  selectedWeek: string
  isFirstWeek: boolean
  isLastWeek: boolean
  goToNextWeek: () => void
  goToPreviousWeek: () => void
  resetSelectedWeek: () => void
}

const props = defineProps<Props>()

const weekRange = computed(() => getWeekRange(props.selectedWeek))
</script>
