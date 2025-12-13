<template>
  <el-card data-testid="memos-table-card">
    <AlertComponent
      :title="error.name"
      :message="error.message"
      type="error"
      v-if="isError && error"
    />
    <h2 data-testid="memos-table-title">Memos Table</h2>
    <el-text size="large">A table of all the distinct Memos in the database</el-text>
    <br />
    <el-text size="default">
      Along with the total Amount Debit and Budget Category, if there is one assigned to it
    </el-text>

    <MemoEditModal ref="memoEditModal" :memo="selectedMemo" />
    <div @contextmenu.prevent>
      <el-table
        v-if="paginatedData"
        :data="paginatedData"
        table-layout="auto"
        :loading="isLoadingCondition"
        size="large"
        :default-sort="{ prop: 'total_amount_debit', order: 'descending' }"
        data-testid="memos-table"
        :row-key="(row: Memo) => row.name"
        @row-contextmenu="openMemoEditModal"
      >
        <el-table-column
          v-for="(column, columnIndex) in memoColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
          :data-testid="`column-${column.prop}`"
        >
          <template #header>
            <span :data-testid="`header-${column.prop}`">{{ column.label }}</span>
          </template>

          <template #default="scope">
            <div
              :data-testid="`cell-${scope.$index}-${columnIndex}`"
              :data-row-id="scope.row.id"
              :data-column="column.prop"
              :data-row-index="scope.$index"
              :data-column-index="columnIndex"
            >
              <router-link
                v-if="column.prop === 'name'"
                :to="{ name: 'memo-summary', params: { memoId: scope.row.id.toString() } }"
                :data-testid="`memo-link-${scope.row.id}`"
              >
                {{ scope.row[column.prop] }}
              </router-link>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="isLoadingCondition" class="loading-container" data-testid="memos-table-loading">
      <el-skeleton :rows="10" animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 200px; margin-bottom: 20px" />
          <div v-for="i in 8" :key="i" class="skeleton-row">
            <el-skeleton-item
              v-for="(width, index) in skeletonWidths"
              :key="index"
              variant="text"
              :style="`width: ${width}px;`"
            />
          </div>
        </template>
      </el-skeleton>
    </div>
    <MemosTablePagination />
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMemos } from '@api/hooks/memos/useMemos.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import MemosTablePagination from '@components/memos/MemosTablePagination.vue'
import MemoEditModal from '@components/memos/MemoEditModal.vue'
import { useRoute, useRouter } from 'vue-router'
import type { Memo } from '@types'

const router = useRouter()
const route = useRoute()

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)
const selectedMemo = ref<Memo | undefined>(undefined)

const skeletonWidths = [100, 150, 200, 120, 180, 160, 140, 130]

// URL-driven pagination state
const currentPage = computed({
  get: () => Number.parseInt(route.query.page as string) || 1,
  set: (value: number) => {
    const query = { ...route.query }
    if (value === 1) {
      delete query.page
    } else {
      query.page = value.toString()
    }
    router.replace({ query })
  },
})

const pageLimit = computed({
  get: () => Number.parseInt(route.query.limit as string) || 100,
  set: (value: number) => {
    const query = { ...route.query }
    if (value === 100) {
      delete query.limit
    } else {
      query.limit = value.toString()
    }
    // Reset to page 1 when changing limit
    delete query.page
    router.replace({ query })
  },
})

const offset = computed(() => (currentPage.value - 1) * pageLimit.value)

const {
  data,
  isLoading,
  isFetching,
  isFetchingNextPage,
  isFetchingPreviousPage,
  isRefetching,
  error,
  isError,
  fetchNextPage,
  hasNextPage,
} = useMemos()

const isLoadingCondition = computed(
  () =>
    isLoading.value ||
    isFetching.value ||
    isRefetching.value ||
    isFetchingNextPage.value ||
    isFetchingPreviousPage.value,
)

const flattenedData = computed(() => {
  return data?.value?.pages.flat() ?? []
})

const paginatedData = computed(() => {
  const start = offset.value
  const end = start + pageLimit.value
  return flattenedData.value.slice(start, end)
})

const loadMorePagesIfNeeded = async () => {
  const requiredDataCount = currentPage.value * pageLimit.value
  while (flattenedData.value.length < requiredDataCount && hasNextPage.value) {
    await fetchNextPage()
  }
}

// Auto-load more data when pagination changes
watch(
  [currentPage, pageLimit],
  () => {
    loadMorePagesIfNeeded()
  },
  { immediate: true },
)

const memoColumns = [
  { prop: 'id', label: 'Id', sortable: true },
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'budget_category', label: 'Budget Category', sortable: false },
  { prop: 'total_amount_debit', label: 'Total Amount Debit', sortable: true },
  { prop: 'necessary', label: 'Necessary', sortable: false },
  { prop: 'recurring', label: 'Recurring', sortable: false },
  { prop: 'frequency', label: 'Frequency', sortable: false },
  { prop: 'ambiguous', label: 'Ambiguous', sortable: false },
]

const openMemoEditModal = (row: Memo) => {
  selectedMemo.value = row
  memoEditModal.value?.openModal()
}

// Expose pagination controls for child components
defineExpose({
  currentPage,
  pageLimit,
  totalPages: computed(() => Math.ceil(flattenedData.value.length / pageLimit.value)),
})
</script>
