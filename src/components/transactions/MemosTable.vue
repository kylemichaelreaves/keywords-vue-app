<template>
  <el-card data-testid="memos-table-card">
    <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error" />
    <h2 data-testid="memos-table-title">Memos Table</h2>
    <el-text size="large">A table of all the distinct Memos in the database</el-text>
    <br />
    <el-text size="default">
      Along with the total Amount Debit and Budget Category, if there is one assigned to it
    </el-text>

    <el-dialog
      v-model="showMemoEditModal"
      :title="editModalTitle"
      :close-on-click-modal="false"
      width="50%"
      data-testid="memo-edit-dialog"
      :before-close="closeMemoEditModal"
    >
      <MemoEditForm
        v-if="selectedMemo"
        :memo="selectedMemo"
        data-testid="memo-edit-form"
        @close="closeMemoEditModal"
      />
    </el-dialog>

    <div @contextmenu.prevent>
      <el-table
        v-if="flattenedData"
        :data="flattenedData"
        table-layout="auto"
        :loading="isFetching || isLoading"
        size="large"
        :default-sort="{ prop: 'total_amount_debit', order: 'descending' }"
        data-testid="memos-table"
        :row-key="(row: Memo) => row.id"
        @row-contextmenu="(row: Memo) => openMemoEditModal(row)"
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
import { computed, ref } from 'vue'
import useMemos from '@api/hooks/transactions/useMemos'
import AlertComponent from '@components/shared/AlertComponent.vue'
import MemosTablePagination from '@components/transactions/MemosTablePagination.vue'
import MemoEditForm from '@components/transactions/MemoEditForm.vue'
import type { Memo } from '@types'


const { data, isLoading, isFetching, error, isError } = useMemos()


const showMemoEditModal = ref(false)
const selectedMemo = ref<Memo | null>(null)

const openMemoEditModal = (memo: Memo) => {
  selectedMemo.value = memo
  showMemoEditModal.value = true
}

const closeMemoEditModal = () => {
  showMemoEditModal.value = false
  selectedMemo.value = null
}

const editModalTitle = computed(() => {
  return selectedMemo.value ? `Edit Memo: ${selectedMemo.value.name}` : 'Create New Memo'
})

const flattenedData = computed(() => {
  return data?.value?.pages.flat() ?? []
})

const memoColumns = [
  { prop: 'id', label: 'Id', sortable: true },
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'budget_category', label: 'Budget Category', sortable: false },
  { prop: 'total_amount_debit', label: 'Total Amount Debit', sortable: true },
  { prop: 'necessary', label: 'Necessary', sortable: false },
  { prop: 'recurring', label: 'Recurring', sortable: false },
  { prop: 'frequency', label: 'Frequency', sortable: false }
]

</script>

<style scoped>
</style>