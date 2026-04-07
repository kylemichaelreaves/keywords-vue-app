<template>
  <div class="bv-categories">
    <div class="bv-intro">
      <h2 class="bv-intro-title">Budget categories</h2>
      <p class="bv-intro-desc">
        Browse and select from the budget category tree.
        Categories assigned here are used to tag memos and transactions.
      </p>
    </div>

    <section class="bv-categories-select">
      <BudgetCategoriesTreeSelect v-model="selected" :teleported="false" />
    </section>

    <div v-if="selected" class="bv-selected-badge">
      <el-tag effect="dark" round type="primary" size="large">{{ selected }}</el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BudgetCategoriesTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'

const selected = ref('')
</script>

<style scoped>
.bv-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bv-intro {
  margin-bottom: 0;
}

.bv-intro-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--app-text-color);
}

.bv-intro-desc {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--bv-sidebar-muted);
  line-height: 1.5;
}

.bv-categories-select {
  max-width: 480px;
}

.bv-categories-select :deep(.el-tree-select) {
  --el-input-border-color: var(--bv-border);
  --el-input-focus-border-color: var(--bv-primary);
}

.bv-selected-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bv-selected-badge :deep(.el-tag) {
  --el-tag-bg-color: var(--bv-primary);
  --el-tag-border-color: var(--bv-primary);
  --el-tag-text-color: var(--bv-primary-fg);
}
</style>
