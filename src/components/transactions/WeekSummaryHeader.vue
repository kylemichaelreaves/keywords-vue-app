<template>
  <div class="header-container" data-testid="week-summary-header">
    <div class="header-left">
      <div>
        <el-text size="large">Week Summary for:</el-text>
        <h2>
          {{ selectedWeek }}
        </h2>
        <el-text size="large">From: {{ weekRange.startDate }} To:
          {{ weekRange.endDate }}
        </el-text>
      </div>
      <WeeklyAmountDebitTotal data-testid="weekly-amount-debit-total" />
    </div>
    <div class="header-right">
      <NavigationButtonGroup
        label="Week"
        :is-last="isLastWeek"
        :is-first="isFirstWeek"
        :go-to-next="goToNextWeek"
        :go-to-previous="goToPreviousWeek"
        :reset="resetSelectedWeek"
        data-testid="week-navigation-button-group"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElText } from 'element-plus'
import WeeklyAmountDebitTotal from './WeeklyAmountDebitTotal.vue'
import NavigationButtonGroup from '@components/shared/NavigationButtonGroup.vue'
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

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.header-right {
  display: flex;
  align-items: flex-start;
}
</style>
