<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error" />
  <el-pagination
    background
    layout="prev, pager, next"
    :total="Number(memosCount)"
    v-model:page-size="limit"
    v-model:current-page="currentPage"
    @update:current-change="handleCurrentChange"
    @update:size-change="handleSizeChange"
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
  return data.value.map((item: { count: number }) => item.count)[0]
})

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
    store.setMemosTableOffset(0)
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
  store.setMemosCount(memosCount.value)
  store.setMemosTableOffset(0)
})


</script>

<style scoped>

</style>