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

    <!-- Show skeleton while loading -->
    <div v-if="isLoading || isFetching || isRefetching">
      <!-- Pie chart skeleton -->
      <div class="chart-container" style="margin-bottom: 32px;">
        <el-skeleton
          animated
          :data-testid="`${props.dataTestId}-pie-skeleton`"
          style="height: 400px; width: 100%;"
        >
          <template #template>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; height: 100%;">
              <el-skeleton-item variant="text" style="width: 60%; height: 24px;" />
              <el-skeleton-item variant="circle" style="width: 300px; height: 300px;" />
              <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 600px;">
                <el-skeleton-item variant="text" style="width: 120px; height: 16px;" />
                <el-skeleton-item variant="text" style="width: 150px; height: 16px;" />
                <el-skeleton-item variant="text" style="width: 100px; height: 16px;" />
                <el-skeleton-item variant="text" style="width: 130px; height: 16px;" />
                <el-skeleton-item variant="text" style="width: 110px; height: 16px;" />
                <el-skeleton-item variant="text" style="width: 140px; height: 16px;" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Statistics skeletons -->
      <el-skeleton
        v-for="(category, index) in skeletonItems"
        :key="`skeleton-${index}`"
        animated
        :data-testid="`${props.dataTestId}-skeleton-${index}`"
        style="margin-bottom: 16px;"
      >
        <template #template>
          <div style="display: flex; align-items: center; gap: 12px;" :style="{ marginLeft: `${category.level * 20}px` }">
            <el-skeleton-item variant="text" :style="{ width: category.level > 0 ? '50%' : '60%' }" />
            <el-skeleton-item variant="text" style="width: 20%;" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- Show actual data when loaded -->
    <div v-else-if="categorySummaries.length > 0">
      <!-- Main content container with side-by-side layout -->
      <div class="chart-and-summaries-container">
        <!-- Statistics Section - Now displayed on the left -->
        <div v-if="hierarchicalSummaries.length > 0" class="summaries-left">
          <div
            v-for="category in hierarchicalSummaries"
            :key="category.budget_category"
            :data-testid="`${props.dataTestId}-category-${category.category_id}`"
          >
            <StatisticComponent
              :value="category.total_amount_debit"
              :title="category.category_name"
              :data-testid="`${props.dataTestId}-statistic-${category.category_id}`"
              :precision="2"
              :size="'small'"
              :style="{ marginLeft: `${category.level * 20}px` }"
              :class="{ 'child-category': category.level > 1 }"
            />
          </div>
        </div>

        <!-- Pie Chart Section - Now displayed on the right -->
        <div class="chart-right">
          <BudgetCategoryPieChart
            :data="categorySummaries"
            :is-loading="false"
            title="Budget Category Distribution"
            :data-testid="`${props.dataTestId}-pie-chart`"
          />
        </div>
      </div>
    </div>

    <!-- Show message when no data -->
    <div v-else style="margin-top: 16px;">
      <el-empty
        description="No data available for the selected period."
        :data-testid="`${props.dataTestId}-no-data`"
      >
        <el-button
          type="primary"
          @click="refetch"
          :data-testid="`${props.dataTestId}-refetch-button`"
        >
          Retry
        </el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, type PropType } from 'vue'
import { useBudgetCategorySummary } from '@api/hooks/transactions/useBudgetCategorySummary.ts'
import StatisticComponent from '@components/shared/StatisticComponent.vue'
import BudgetCategoryPieChart from '@components/charts/BudgetCategoryPieChart.vue'
import { useTransactionsStore } from '@stores/transactions'
import type { TimeframeType } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'

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

const store = useTransactionsStore()

// Create reactive computed properties that will trigger query updates
const reactiveTimeFrame = computed(() => props.timeFrame)
const reactiveDate = computed(() => props.date)

console.log('BudgetCategorySummaries: Props received', {
  timeFrame: props.timeFrame,
  date: props.date,
  dataTestId: props.dataTestId
})

const { data, isLoading, isFetching, isRefetching, isError, error, refetch } = useBudgetCategorySummary(
  reactiveTimeFrame,
  reactiveDate
)

// Watch for changes in store values and force refetch
watch(() => store.getSelectedMonth, (newMonth, oldMonth) => {
  console.log('BudgetCategorySummaries: Selected month changed', {
    from: oldMonth,
    to: newMonth,
    currentTimeFrame: props.timeFrame
  })
  if (props.timeFrame === 'month' && newMonth !== oldMonth) {
    console.log('BudgetCategorySummaries: Refetching for month change')
    refetch()
  }
}, { immediate: false })

watch(() => store.getSelectedWeek, (newWeek, oldWeek) => {
  console.log('BudgetCategorySummaries: Selected week changed', {
    from: oldWeek,
    to: newWeek,
    currentTimeFrame: props.timeFrame
  })
  if (props.timeFrame === 'week' && newWeek !== oldWeek) {
    console.log('BudgetCategorySummaries: Refetching for week change')
    refetch()
  }
}, { immediate: false })

watch(() => store.getSelectedDay, (newDay, oldDay) => {
  console.log('BudgetCategorySummaries: Selected day changed', {
    from: oldDay,
    to: newDay,
    currentTimeFrame: props.timeFrame
  })
  if (props.timeFrame === 'day' && newDay !== oldDay) {
    console.log('BudgetCategorySummaries: Refetching for day change')
    refetch()
  }
}, { immediate: false })

// Also watch for changes to the props themselves
watch(() => [props.date, props.timeFrame], ([newDate, newTimeFrame], [oldDate, oldTimeFrame]) => {
  console.log('BudgetCategorySummaries: Props changed', {
    date: { from: oldDate, to: newDate },
    timeFrame: { from: oldTimeFrame, to: newTimeFrame }
  })
  if (newDate !== oldDate || newTimeFrame !== oldTimeFrame) {
    console.log('BudgetCategorySummaries: Refetching for prop changes')
    refetch()
  }
}, { immediate: false })

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
    console.log('BudgetCategorySummaries: No data from API')
    return []
  }

  const result = data.value.map((item: BudgetCategorySummary) => item)
  console.log('BudgetCategorySummaries: categorySummaries computed', {
    dataLength: data.value.length,
    resultLength: result.length,
    sampleData: result[0]
  })
  return result
})

const hierarchicalSummaries = computed((): BudgetCategorySummary[] => {
  if (!categorySummaries.value.length) {
    return []
  }

  // create a map for quick parent lookup
  const childrenMap = new Map<number, BudgetCategorySummary[]>()

  // build maps
  categorySummaries.value.forEach(category => {
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

// Create skeleton items based on the hierarchical structure
const skeletonItems = computed(() => {
  return hierarchicalSummaries.value.map(category => {
    return {
      ...category,
      total_amount_debit: null // or some placeholder value
    }
  })
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

.chart-and-summaries-container {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}

.summaries-left {
  flex: 0 0 250px; /* Reduced from 280px to give more space to chart */
  min-width: 200px;
  overflow-y: auto; /* Add scroll if content is too long */
  padding-right: 16px; /* Add some padding for scroll */
}

.chart-right {
  flex: 1; /* Takes up remaining space */
  min-width: 500px; /* Increased minimum width for better chart display */
  display: flex;
  justify-content: flex-start; /* Align chart to the left within its container */
}

.summaries-title {
  font-size: 16px; /* Smaller title */
  margin-bottom: 12px; /* Reduced margin */
  font-weight: 600;
  color: #333;
}

/* Make individual statistics more compact */
.summaries-left :deep(.el-statistic) {
  margin-bottom: 8px !important;
}

.summaries-left :deep(.el-statistic__head) {
  font-size: 13px !important;
  margin-bottom: 2px !important;
}

</style>