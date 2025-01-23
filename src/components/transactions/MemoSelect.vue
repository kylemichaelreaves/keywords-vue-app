<template>
  <SelectComponent
      data-testid="memo-select"
      :on-change="updateSelectedMemo"
      placeholder="select a memo"
      :selectedValue="selectedMemo"
      :options="memoOptions"
  />
</template>

<script setup lang='ts'>
import {computed, onMounted} from 'vue'
import useMemos from "@api/hooks/transactions/useMemos";
import {useTransactionsStore} from "@stores/transactions";
import type {Memo} from "@types";
import SelectComponent from "@components/shared/SelectComponent.vue";


const transactionsStore = useTransactionsStore()

const selectedMemo = computed(() => transactionsStore.getSelectedMemo);

const {data, isLoading, isFetching, isError, error, refetch} = useMemos()

const memoOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value.map((item: Memo) => ({
    value: item.name,
    label: item.name,
  }));
});

const updateSelectedMemo = (memo: string) => {
  transactionsStore.setSelectedMemo(memo)
}

onMounted(() => {
  if (data.value) {
    transactionsStore.setMemos(data.value)
  }
})


</script>

<style scoped>
</style>
