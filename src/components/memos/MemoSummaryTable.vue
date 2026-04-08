<template>
  <div class="bv-memo-summary">
    <AlertComponent
      v-if="isError && typedError"
      :title="typedError?.name || 'Error'"
      :message="typedError?.message || 'An error occurred'"
      type="error"
      data-testid="memo-summary-error"
    />

    <div class="bv-memo-header" data-testid="memo-summary-card">
      <div class="bv-memo-header-top" data-testid="memo-summary-header">
        <h2 class="bv-memo-title" data-testid="memo-title">
          {{ typedMemoData?.name || 'Loading...' }}
        </h2>
        <MemoBudgetCategory v-if="typedMemoData" :memo-id="memoId" />
      </div>

      <div v-if="typedSummaryData" class="bv-stats" data-testid="memo-summary-stats">
        <div class="bv-stat-card">
          <el-statistic
            title="Total Amount Debit"
            :value="typedSummaryData.sum_amount_debit"
            prefix="$"
            :precision="2"
            :data-testid="`sum-amount-debit-${memoId}`"
            :data-value="typedSummaryData.sum_amount_debit"
          />
        </div>
        <div class="bv-stat-card">
          <el-statistic
            title="Transactions Count"
            :value="typedSummaryData.transactions_count"
            :data-testid="`transactions-count-${memoId}`"
            :data-value="typedSummaryData.transactions_count"
          />
        </div>
      </div>

      <div v-else-if="isLoadingCondition" class="bv-loading">
        <el-skeleton :rows="2" animated />
      </div>
    </div>

    <section class="bv-section bv-table-section">
      <MemoTransactionsTable :memo-id="memoId" data-testid="memo-transactions-table" />
    </section>

    <BackButton data-testid="memo-summary-back-button" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import useMemoSummary from '@api/hooks/memos/useMemoSummary.ts'
import useMemo from '@api/hooks/memos/useMemo.ts'
import MemoTransactionsTable from '@components/memos/MemoTransactionsTable.vue'
import MemoBudgetCategory from '@components/memos/MemoBudgetCategory.vue'
import BackButton from '@components/shared/BackButton.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import type { Memo, MemoSummary } from '@types'

const route = useRoute()
const memoId = computed(() => Number.parseInt(route.params.memoId as string))

// Fetch memo data to get the memo name and other details
const { data: memoData, isLoading: memoLoading, isFetching: memoFetching } = useMemo(memoId.value)

// Fetch memo summary data
const {
  data: summaryData,
  isFetching: summaryFetching,
  isLoading: summaryLoading,
  isError,
  error,
} = useMemoSummary(memoId.value)

// Type assertions to help IDE with type resolution
const typedSummaryData = summaryData as Ref<MemoSummary | undefined>
const typedMemoData = memoData as Ref<Memo | undefined>
const typedError = error as Ref<Error | null>

// Create typed loading refs
const typedSummaryLoading = summaryLoading as Ref<boolean>
const typedSummaryFetching = summaryFetching as Ref<boolean>
const typedMemoLoading = memoLoading as Ref<boolean>
const typedMemoFetching = memoFetching as Ref<boolean>

const isLoadingCondition = computed(
  () =>
    typedSummaryLoading.value ||
    typedSummaryFetching.value ||
    typedMemoLoading.value ||
    typedMemoFetching.value,
)
</script>

<style scoped>
.bv-memo-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bv-memo-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bv-memo-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.bv-memo-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--app-text-color);
}

.bv-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.bv-stat-card {
  padding: 1rem 1.25rem;
  border: 1px solid var(--bv-border);
  border-radius: var(--bv-radius);
  background: var(--bv-panel-bg);
}

.bv-stat-card :deep(.el-statistic__head) {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bv-sidebar-muted);
}

.bv-stat-card :deep(.el-statistic__content) {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-color);
}

.bv-loading {
  padding: 1.5rem 0;
}

.bv-section {
  border-radius: var(--bv-radius);
}

.bv-table-section :deep(.el-table) {
  --el-table-border-color: var(--bv-border);
  --el-table-header-bg-color: var(--bv-muted-bg);
  --el-table-row-hover-bg-color: var(--bv-accent);
  border-radius: var(--bv-radius);
  overflow: hidden;
}

.bv-table-section :deep(.el-table th.el-table__cell) {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--app-text-color);
}

@media (max-width: 768px) {
  .bv-memo-header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .bv-stats {
    grid-template-columns: 1fr;
  }
}
</style>
