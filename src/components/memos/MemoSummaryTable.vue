<template>
  <div>
    <AlertComponent
      v-if="isError && typedError"
      :title="typedError?.name || 'Error'"
      :message="typedError?.message || 'An error occurred'"
      type="error"
      data-testid="memo-summary-error"
    />

    <el-card data-testid="memo-summary-card">
      <template #header>
        <div class="header-content" data-testid="memo-summary-header">
          <h2 class="memo-title" data-testid="memo-title">
            {{ typedMemoData?.name || 'Loading...' }}
          </h2>
          <MemoBudgetCategory v-if="typedMemoData" :memo-id="memoId" />
        </div>
      </template>

      <div v-if="typedSummaryData" class="summary-stats" data-testid="memo-summary-stats">
        <el-statistic
          title="Total Amount Debit"
          :value="typedSummaryData.sum_amount_debit"
          prefix="$"
          :precision="2"
          class="stat-item"
          :data-testid="`sum-amount-debit-${memoId}`"
          :data-value="typedSummaryData.sum_amount_debit"
        />
        <el-statistic
          title="Transactions Count"
          :value="typedSummaryData.transactions_count"
          class="stat-item"
          :data-testid="`transactions-count-${memoId}`"
          :data-value="typedSummaryData.transactions_count"
        />
      </div>

      <div v-else-if="isLoadingCondition" class="loading-container">
        <el-skeleton :rows="2" animated />
      </div>
    </el-card>

    <MemoTransactionsTable :memo-id="memoId" data-testid="memo-transactions-table" />

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
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.memo-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  flex: 1;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 1rem 0;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-page);
}

.loading-container {
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .summary-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
