<template>
  <div :data-testid="props.dataTestId">
    <AlertComponent
      :title="error.name"
      :message="error.message"
      type="error"
      :data-testid="`${props.dataTestId}-error-alert`"
      v-if="isError && error"
    />
    <el-space
      direction="vertical"
      class="w-full"
      :data-testid="`${props.dataTestId}-header`"
    >
      <el-text
        size="large"
        :data-testid="`${props.dataTestId}-title`"
      >
        Sums of the amount_debit column for a budget_category
      </el-text>
    </el-space>
    <div
      v-for="category in hierarchicalSummaries"
      :key="category.budget_category"
      :data-testid="`${props.dataTestId}-category-${category.category_id}`"
    >
      <StatisticComponent
        :value="category.total_amount_debit"
        :title="category.category_name"
        :data-testid="`${props.dataTestId}-statistic-${category.category_id}`"
        v-loading="isLoading || isFetching || isRefetching"
        :precision="2"
        :style="{ marginLeft: `${category.level * 20}px` }"
        :class="{ 'child-category': category.level > 1 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, defineProps } from 'vue'
import type { TimeframeType } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { useBudgetCategorySummary } from '@api/hooks/transactions/useBudgetCategorySummary.ts'
import StatisticComponent from '@components/shared/StatisticComponent.vue'

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  timeFrame: {
    type: String as PropType<TimeframeType>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'budget-category-summaries'
  }
})

const { data, isLoading, isFetching, isRefetching, isError, error } = useBudgetCategorySummary(
  props.timeFrame,
  props.date
)

export interface CategoryObject {
  category_id: number
  category_name: string
  full_path: string
  level: number
  parent_id: number | null
  source_id: number
}

interface BudgetCategorySummary extends CategoryObject {
  budget_category: string
  total_amount_debit: number
}

const categorySummaries = computed((): BudgetCategorySummary[] => {
  if (!data?.value) {
    return []
  }

  return data.value.map((item: BudgetCategorySummary) => item)
})

const hierarchicalSummaries = computed((): BudgetCategorySummary[] => {
  if (!categorySummaries.value.length) {
    return []
  }

  // create a map for quick parent lookup
  const categoryMap = new Map<number, BudgetCategorySummary>()
  const childrenMap = new Map<number, BudgetCategorySummary[]>()

  // build maps
  categorySummaries.value.forEach(category => {
    categoryMap.set(category.category_id, category)
    if (category.parent_id !== null) {
      if (!childrenMap.has(category.parent_id)) {
        childrenMap.set(category.parent_id, [])
      }
      childrenMap.get(category.parent_id)!.push(category)
    }
  })

  // a helper function to recursively build the hierarchical list
  const buildHierarchy = (parentId: number | null): BudgetCategorySummary[] => {
    const result: BudgetCategorySummary[] = []
    // get categories with the specified parent_id
    const categories = categorySummaries.value.filter(cat => cat.parent_id === parentId)
    // sort by category name for consistent ordering
    categories.sort((a, b) => a.category_name.localeCompare(b.category_name))
    // add the parent category and recursively add its children
    categories.forEach(category => {
      result.push(category)
      const children = buildHierarchy(category.category_id)
      result.push(...children)
    })
    return result
  }
  // start with root, AKA parentless, AKA null, categories
  return buildHierarchy(null)
})

</script>

<style scoped>
.child-category {
  opacity: 0.8;
}

.child-category::before {
  content: "└─";
  color: #888;
  margin-right: 16px;
}
</style>