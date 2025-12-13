<template>
  <div class="table-skeleton" data-testid="table-skeleton">
    <el-table :data="skeletonData" height="auto" size="small" border stripe show-summary>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        width="auto"
      >
        <template v-slot:default>
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="text" :style="{ width: getSkeletonWidth(column.prop) }" />
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SkeletonColumn {
  prop: string
  label: string
}

interface Props {
  columns: SkeletonColumn[]
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 10,
})

// Create skeleton data with the specified number of rows
const skeletonData = computed(() => {
  return Array.from({ length: props.rows }, (_, index) => {
    const row: Record<string, string> = {}
    props.columns.forEach((column) => {
      row[column.prop] = `skeleton-${index}-${column.prop}`
    })
    return row
  })
})

// Generate appropriate skeleton widths based on column type
const getSkeletonWidth = (columnProp: string): string => {
  const widthMap: Record<string, string> = {
    id: '60px',
    transaction_number: '120px',
    date: '100px',
    description: '200px',
    memo_id: '80px',
    memo: '100px',
    amount_debit: '100px',
    amount_credit: '100px',
    balance: '100px',
    budget_category: '150px',
  }

  return widthMap[columnProp] || '120px'
}
</script>

<style scoped>
.table-skeleton {
  opacity: 0.8;
}

.table-skeleton :deep(.el-skeleton__text) {
  background: linear-gradient(
    90deg,
    var(--skeleton-base-color) 25%,
    var(--skeleton-highlight-color) 50%,
    var(--skeleton-base-color) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

/* Theme-aware skeleton colors */
:root {
  --skeleton-base-color: #f0f0f0;
  --skeleton-highlight-color: #e0e0e0;
}

:root.dark {
  --skeleton-base-color: #3a3a3a;
  --skeleton-highlight-color: #4a4a4a;
}

:root.light {
  --skeleton-base-color: #f0f0f0;
  --skeleton-highlight-color: #e0e0e0;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
