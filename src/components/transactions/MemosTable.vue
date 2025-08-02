<template>
  <el-card data-testid="memos-table-card">
    <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error" />
    <h2 data-testid="memos-table-title">Memos Table</h2>
    <el-text size="large">A table of all the distinct Memos in the database</el-text>
    <br />
    <el-text size="default">
      Along with the total Amount Debit and Budget Category, if there is one assigned to it
    </el-text>

    <MemoEditModal ref="memoEditModal" />

    <div @contextmenu.prevent>
      <el-table
        v-if="paginatedData"
        :data="paginatedData"
        table-layout="auto"
        :loading="isLoadingCondition"
        size="large"
        :default-sort="{ prop: 'total_amount_debit', order: 'descending' }"
        data-testid="memos-table"
        :row-key="(row: Memo) => row.id"
        @row-contextmenu="(row: Memo) => memoEditModal?.openModal(row)"
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
                :to="{ name: 'memo', params: { memoName: scope.row[column.prop] } }"
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
    <MemosTablePagination />
  </el-card>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import useMemos from '@api/hooks/transactions/useMemos'
import AlertComponent from '@components/shared/AlertComponent.vue'
import MemosTablePagination from '@components/transactions/MemosTablePagination.vue'
import MemoEditModal from '@components/transactions/MemoEditModal.vue'
import { useTransactionsStore } from '@stores/transactions'
import { useRoute, useRouter } from 'vue-router'
import type { Memo } from '@types'

const store = useTransactionsStore()
const router = useRouter()
const route = useRoute()

// Track if we're updating from URL to prevent loops
let updatingFromURL = false

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)

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
  hasNextPage
} = useMemos()


const isLoadingCondition = computed(() => 
  isLoading.value ||
  isFetching.value ||
  isRefetching.value ||
  isFetchingNextPage.value ||
  isFetchingPreviousPage.value
)

const flattenedData = computed(() => {
  return data?.value?.pages.flat() ?? []
})

const currentPage = computed({
  get: () => Math.floor(store.memosTableOffset / store.memosTableLimit) + 1,
  set: (val: number) => {
    store.setMemosTableOffset((val - 1) * store.memosTableLimit)
  }
})

const LIMIT = computed(() => store.memosTableLimit)


const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * LIMIT.value
  const end = start + LIMIT.value
  return flattenedData.value.slice(start, end)
})


const loadMorePagesIfNeeded = async () => {
  const requiredDataCount = currentPage.value * LIMIT.value
  while (flattenedData.value.length < requiredDataCount && hasNextPage.value) {
    await fetchNextPage()
  }
}

watch(currentPage, () => {
  loadMorePagesIfNeeded()
})

// URL Sync Logic
const updateURL = () => {
  if (updatingFromURL) return

  const query: Record<string, string> = {}

  // Only add page if not page 1
  if (currentPage.value > 1) {
    query.page = currentPage.value.toString()
  }

  // Only add limit if different from default
  if (LIMIT.value !== 100) {
    query.limit = LIMIT.value.toString()
  }

  router.replace({
    name: route.name,
    params: route.params,
    query: Object.keys(query).length > 0 ? query : undefined
  })
}

// Watch for pagination changes and update URL
watch([currentPage, LIMIT], () => {
  updateURL()
}, { flush: 'post' })

// Initialize from URL on mount
onMounted(() => {
  updatingFromURL = true

  const urlPage = parseInt(route.query.page as string) || 1
  const urlLimit = parseInt(route.query.limit as string) || store.memosTableLimit

  // Update store if URL has different values
  if (urlLimit !== store.memosTableLimit) {
    store.setMemosTableLimit(urlLimit)
  }

  if (urlPage !== currentPage.value) {
    store.setMemosTableOffset((urlPage - 1) * urlLimit)
  }

  nextTick(() => {
    updatingFromURL = false
  })
})

const memoColumns = [
  { prop: 'id', label: 'Id', sortable: true },
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'budget_category', label: 'Budget Category', sortable: false },
  { prop: 'total_amount_debit', label: 'Total Amount Debit', sortable: true },
  { prop: 'necessary', label: 'Necessary', sortable: false },
  { prop: 'recurring', label: 'Recurring', sortable: false },
  { prop: 'frequency', label: 'Frequency', sortable: false },
  { prop: 'ambiguous', label: 'Ambiguous', sortable: false }
]
</script>