<template>
  <div v-if="isError">
    <el-alert tile="{{error.name + ',' + error.code}}" type="error" :description="error?.message" show-icon/>
  </div>
  <el-table v-if="data" :data="data" style="width: 100%" border :loading="isLoading || isFetching">
    <el-table-column
        v-for="(value, key) in transaction"
        :key="key"
        :prop="key"
        :label="key"
    />
  </el-table>
</template>

<script setup lang="ts">
import {type PropType, watchEffect} from "vue";
import type {Transaction} from "@types"
import useTransaction from "@api/hooks/transactions/useTransaction";

const props = defineProps({
  transaction: {
    type: Object as unknown as PropType<Transaction>,
    required: true
  }
});

console.log('props', props);

const {data, isLoading, isFetching, isError, error} = useTransaction(props.transaction.transactionNumber);

console.log('data', data);

const displayData = [props.transaction];

watchEffect(() => {
  displayData[0] = props.transaction;
});

console.log('displayData', displayData);


</script>

<style>
</style>

