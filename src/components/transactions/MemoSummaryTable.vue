<template>
  <div>
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-testid="memo-summary-error"
    />

    <el-card data-testid="memo-summary-card">
      <template #header>
        <div class="header-content" data-testid="memo-summary-header">
          <h2 class="memo-title" data-testid="memo-title">
            {{ memoName }}
          </h2>
          <MemoBudgetCategory
            v-if="memoName"
            :memo-name="memoName"
            data-testid="budget-category-button"
          />
        </div>
      </template>

      <div v-if="data" class="summary-stats" data-testid="memo-summary-stats">
        <el-statistic
          title="Total Amount Debit"
          :value="data.sum_amount_debit"
          prefix="$"
          :precision="2"
          class="stat-item"
          :data-testid="`sum-amount-debit-${memoName}`"
          :data-value="data.sum_amount_debit"
        />
        <el-statistic
          title="Transactions Count"
          :value="data.transactions_count"
          class="stat-item"
          :data-testid="`transactions-count-${memoName}`"
          :data-value="data.transactions_count"
        />
      </div>

      <div v-else-if="isLoadingCondition" class="loading-container">
        <el-skeleton :rows="2" animated />
      </div>
    </el-card>

    <MemoTransactionsTable
      :memo-name="memoName"
      data-testid="memo-transactions-table"
    />

    <BackButton data-testid="memo-summary-back-button" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useMemoSummary from '@api/hooks/transactions/useMemoSummary'
import MemoTransactionsTable from '@components/transactions/MemoTransactionsTable.vue'
import MemoBudgetCategory from '@components/transactions/MemoBudgetCategory.vue'
import BackButton from '@components/shared/BackButton.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

const route = useRoute()
const memoName = computed(() => route.params.memoName as string)

const { data, isFetching, isLoading, isError, error } = useMemoSummary(memoName.value)

const isLoadingCondition = computed(() => isLoading.value || isFetching.value)
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