<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <SelectComponent
      data-testid="memo-select"
      :on-change="updateSelectedMemo"
      placeholder="select a memo"
      :selectedValue="selectedMemo"
      :options="memoOptions"
      :disabled="isFetching || isLoading || isRefetching"
  />
</template>

<!--TODO implement autocomplete functionality -->

<script setup lang='ts'>
import {computed, onMounted} from 'vue'
import useMemos from "@api/hooks/transactions/useMemos";
import {useTransactionsStore} from "@stores/transactions";
import type {Memo} from "@types";
import SelectComponent from "@components/shared/SelectComponent.vue";
import AlertComponent from '@components/shared/AlertComponent.vue'
import { httpClient } from '@api/httpClient.ts'


const transactionsStore = useTransactionsStore()

const selectedMemo = computed(() => transactionsStore.getSelectedMemo);

const {data, isLoading, isFetching, isError, error, refetch, isRefetching} = useMemos()

const memoOptions = computed(() => {
  if (!data.value) {
    return [];
  }

  // `data.value.pages` is an array of arrays.
  // Flatten them if each page is an array of Memos:
  const allMemos = data.value.pages.flatMap(page => page);

  return allMemos.map((memo: Memo) => ({
    value: memo.name,
    label: memo.name,
  }));
});

const updateSelectedMemo = (memo: string) => {
  transactionsStore.setSelectedMemo(memo)
}

// fetchMemosByName
const fetchMemosByName = async (memo: string) => {
  return httpClient.get(`/memos?name=${memo}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching memo:', error);
      throw error;
    });
}

onMounted(() => {
  if (data.value) {
    transactionsStore.setMemos(data.value.pages.flatMap(page => page));
  }
})


</script>

<style scoped>
</style>
