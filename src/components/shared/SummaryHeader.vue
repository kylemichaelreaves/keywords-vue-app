<template>
  <div
    class="header-container"
    :data-testid="`${timeFrame.toLowerCase()}-summary-header`"
    :data-selected-period="selectedPeriod"
  >
    <div class="header-left" :data-testid="`${timeFrame.toLowerCase()}-summary-left-section`">
      <div class="title-section">
        <h2 :data-testid="`${timeFrame.toLowerCase()}-summary-title`">
          {{ timeFrame }} Summary for: {{ selectedPeriod }}
        </h2>
        <slot name="subtitle" />
      </div>
      <slot name="amount-total" />
    </div>
    <div class="header-right">
      <NavigationButtonGroup
        :label="timeFrame"
        :is-last="isLast"
        :is-first="isFirst"
        :go-to-next="goToNext"
        :go-to-previous="goToPrevious"
        :reset="reset"
        :data-testid="`${timeFrame.toLowerCase()}-summary-navigation-button-group`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationButtonGroup from './NavigationButtonGroup.vue'

interface Props {
  timeFrame: 'Month' | 'Week'
  selectedPeriod: string
  isFirst: boolean
  isLast: boolean
  goToNext: () => void
  goToPrevious: () => void
  reset: () => void
}

defineProps<Props>()
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

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Month-specific alignment */
.header-container[data-testid="month-summary-header"] .header-left {
  align-items: center;
  gap: 2.5rem;
}

.header-container[data-testid="month-summary-header"] .title-section {
  flex-direction: row;
  align-items: center;
  gap: 2.5rem;
}

/* Week-specific alignment */
.header-container[data-testid="week-summary-header"] .header-left {
  align-items: center;
  flex-direction: row;
  gap: 2.5rem;
}
.header-container[data-testid="week-summary-header"] .title-section {
  flex-direction: column;
  gap: 0.005rem;
}
</style>
