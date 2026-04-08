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
        <div class="bv-memo-title-row">
          <h2 class="bv-memo-title" data-testid="memo-title">
            {{ typedMemoData?.name || 'Loading...' }}
          </h2>
          <el-tag
            v-if="typedMemoData"
            :type="typedMemoData.ambiguous ? 'warning' : 'success'"
            size="small"
            effect="plain"
            round
            data-testid="memo-ambiguous-badge"
          >
            {{ typedMemoData.ambiguous ? 'Ambiguous' : 'Resolved' }}
          </el-tag>
          <el-tag
            v-if="typedMemoData?.recurring"
            type="info"
            size="small"
            effect="plain"
            round
            data-testid="memo-recurring-badge"
          >
            Recurring
          </el-tag>
        </div>
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
          <div class="bv-toggle-row">
            <span class="bv-toggle-label">Ambiguous</span>
            <el-switch
              v-model="localAmbiguous"
              size="small"
              data-testid="memo-ambiguous-toggle"
              @change="
                (val: boolean | string | number) => toggleMemoField('ambiguous', Boolean(val))
              "
            />
          </div>
        </div>
        <div class="bv-stat-card">
          <el-statistic
            title="Transactions Count"
            :value="typedSummaryData.transactions_count"
            :data-testid="`transactions-count-${memoId}`"
            :data-value="typedSummaryData.transactions_count"
          />
          <div class="bv-toggle-row">
            <span class="bv-toggle-label">Recurring</span>
            <el-switch
              v-model="localRecurring"
              size="small"
              data-testid="memo-recurring-toggle"
              @change="
                (val: boolean | string | number) => toggleMemoField('recurring', Boolean(val))
              "
            />
          </div>
        </div>
        <div class="bv-stat-card">
          <el-statistic
            title="Budget Category"
            :value="0"
            :formatter="() => typedMemoData?.budget_category || '--'"
            data-testid="memo-budget-category-stat"
          />
          <div class="bv-toggle-row">
            <span class="bv-toggle-label">Necessary</span>
            <el-switch
              v-model="localNecessary"
              size="small"
              data-testid="memo-necessary-toggle"
              @change="
                (val: boolean | string | number) => toggleMemoField('necessary', Boolean(val))
              "
            />
          </div>
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
import { computed, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import useMemoSummary from '@api/hooks/memos/useMemoSummary.ts'
import useMemo from '@api/hooks/memos/useMemo.ts'
import mutateMemo from '@api/hooks/memos/mutateMemo.ts'
import MemoTransactionsTable from '@components/memos/MemoTransactionsTable.vue'
import MemoBudgetCategory from '@components/memos/MemoBudgetCategory.vue'
import BackButton from '@components/shared/BackButton.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import type { Memo, MemoSummary } from '@types'

const route = useRoute()
const memoId = computed(() => Number.parseInt(route.params.memoId as string))

// Fetch memo data to get the memo name and other details
const {
  data: memoData,
  isLoading: memoLoading,
  isFetching: memoFetching,
  refetch: refetchMemo,
} = useMemo(memoId.value)

// Fetch memo summary data
const {
  data: summaryData,
  isFetching: summaryFetching,
  isLoading: summaryLoading,
  isError,
  error,
} = useMemoSummary(memoId.value)

const { mutate } = mutateMemo()

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

const localAmbiguous = ref(false)
const localRecurring = ref(false)
const localNecessary = ref(false)

watch(
  typedMemoData,
  (memo) => {
    if (memo) {
      localAmbiguous.value = memo.ambiguous ?? false
      localRecurring.value = memo.recurring ?? false
      localNecessary.value = memo.necessary ?? false
    }
  },
  { immediate: true },
)

function toggleMemoField(field: 'ambiguous' | 'recurring' | 'necessary', value: boolean) {
  const memo = typedMemoData.value
  if (!memo) return

  if (field === 'ambiguous') localAmbiguous.value = value
  else if (field === 'recurring') localRecurring.value = value
  else if (field === 'necessary') localNecessary.value = value

  mutate(
    { memo: { id: memo.id, name: memo.name, [field]: value } },
    {
      onSuccess: () => refetchMemo(),
      onError: () => {
        localAmbiguous.value = memo.ambiguous ?? false
        localRecurring.value = memo.recurring ?? false
        localNecessary.value = memo.necessary ?? false
      },
    },
  )
}
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

.bv-memo-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  grid-template-columns: repeat(3, 1fr);
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

.bv-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--bv-border);
}

.bv-toggle-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--bv-sidebar-muted);
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
