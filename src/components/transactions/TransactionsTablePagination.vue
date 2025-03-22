<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error" />
  <el-pagination
    data-testid="transactions-table-pagination"
    background
    layout="prev, pager, next"
    :total="Number(transactionsCount)"
    v-model:page-size="limit"
    v-model:current-page="currentPage"
    @update:current-change="handleCurrentChange"
    @update:size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import useTransactionsCount from '@api/hooks/transactions/useTransactionsCount'
import { computed, onMounted } from 'vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { useTransactionsStore } from '@stores/transactions'

const { data, isError, error, refetch } = useTransactionsCount()

const store = useTransactionsStore()

const transactionsCount = computed(() => {
  if (!data.value) {
    return 0
  }
  return data.value.map((item: { transactions_count: number }) => item.transactions_count)[0]
})

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit)
  }
})

const limit = computed({
  get: () => store.transactionsTableLimit,
  set: (val: number) => {
    store.setTransactionsTableLimit(val)
    store.updateTransactionsTableOffset(0)
  }
})

function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
}

function handleSizeChange(newSize: number) {
  limit.value = newSize
  currentPage.value = 1
}

onMounted(() => {
  refetch()
  store.updateTransactionsTableOffset(0)
  store.setTransactionsCount(data.value)
})


</script>

<style scoped>

</style>