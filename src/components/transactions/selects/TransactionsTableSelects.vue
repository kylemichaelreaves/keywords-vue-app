<template>
  <div class="selects" :data-testid="props.dataTestId">
    <div class="selects-row">
      <DaySelect />
      <WeekSelect />
      <MonthSelect />
      <YearSelect />
      <MemoSelect class="memo-select" />
    </div>
    <el-button
      v-if="hasActiveFilters"
      size="small"
      data-testid="clear-filters-button"
      @click="clearAllFilters"
    >
      Clear Filters
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import MonthSelect from '@components/transactions/selects/MonthSelect.vue'
import WeekSelect from '@components/transactions/selects/WeekSelect.vue'
import DaySelect from '@components/transactions/selects/DaySelect.vue'
import YearSelect from '@components/transactions/selects/YearSelect.vue'
import { useTransactionsStore } from '@stores/transactions'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-selects-row',
  },
})

const router = useRouter()
const store = useTransactionsStore()

const hasActiveFilters = computed(
  () =>
    !!store.getSelectedDay ||
    !!store.getSelectedWeek ||
    !!store.getSelectedMonth ||
    !!store.getSelectedYear ||
    !!store.getSelectedMemo,
)

function clearAllFilters() {
  store.setSelectedDay('')
  store.setSelectedWeek('')
  store.setSelectedMonth('')
  store.setSelectedYear('')
  store.setSelectedMemo('')
  router.replace({ name: 'transactions', query: {} })
}
</script>

<style scoped>
.selects {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selects-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
}

.memo-select {
  flex: 1;
  min-width: 200px;
}

.selects :deep(.el-select),
.selects :deep(.el-input) {
  --el-input-border-color: var(--bv-border);
  --el-input-focus-border-color: var(--bv-primary);
}
</style>
