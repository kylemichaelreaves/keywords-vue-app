<template>
  <el-text size="large">Transaction Number:</el-text>
  <h2>{{ props.transactionNumber }}</h2>
  <el-text>Note: transaction numbers are not unique…</el-text>
  <div v-if="isError">
    <el-alert tile="{{error.name + ',' + error.code}}" type="error" :description="error?.message" show-icon />
  </div>
  <el-table v-if="data" :data="transaction" style="width: 100%" border :loading="isLoadingCondition" size="small">
    <el-table-column
      v-for="(value, key) in transaction"
      :key="key"
      :prop="key"
      :label="key"
    />
  </el-table>
  <BackButton />
</template>

<script setup lang="ts">
import { computed, type PropType, reactive } from 'vue'
import type { Transaction } from '@types'
import useTransaction from '@api/hooks/transactions/useTransaction'
import BackButton from '@components/shared/BackButton.vue'

const props = defineProps({
  transactionNumber: {
    type: String as PropType<Transaction['transaction_number']>,
    required: true
  }
})


const { data, isLoading, isFetching, isError, error } = useTransaction(props.transactionNumber)

const isLoadingCondition = reactive(
  isLoading || isFetching
)

const transaction = computed(() => {
  return data?.value
})


</script>

<style>
h2 {
  margin-bottom: 20px;
  text-decoration: underline;
}
</style>

