<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error" />
  <el-pagination
    background
    layout="prev, pager, next"
    :total="Number(memosCount)"
    v-model:page-size="limit"
    v-model:current-page="currentPage"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import useMemosCount from '@api/hooks/transactions/useMemosCount'
import { computed, onMounted } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import AlertComponent from '@components/shared/AlertComponent.vue'

const { data, isError, error } = useMemosCount()

const store = useTransactionsStore()

const memosCount = computed(() => {
  if (!data.value) {
    return 0
  }
  return data.value[0].count
})

// Same pattern as transactions - both components use identical currentPage computed
const currentPage = computed({
  get: () => Math.floor(store.memosTableOffset / store.memosTableLimit) + 1,
  set: (val: number) => {
    store.setMemosTableOffset((val - 1) * store.memosTableLimit)
  }
})

const limit = computed({
  get: () => store.memosTableLimit,
  set: (val: number) => {
    store.setMemosTableLimit(val)
    store.setMemosTableOffset(0) // Reset to first page when limit changes
  }
})

function handleCurrentChange(newPage: number) {
  // This updates the store offset via the currentPage setter
  currentPage.value = newPage
}

function handleSizeChange(newSize: number) {
  // Update limit (which resets offset to 0) then set page to 1
  limit.value = newSize
  currentPage.value = 1
}

onMounted(() => {
  // Initialize pagination state
  store.setMemosTableOffset(0)
})
</script>

<style scoped>
</style>