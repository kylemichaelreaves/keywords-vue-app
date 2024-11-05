<template>
  <SelectComponent
      data-testid="memo-select"
      :on-change="updateSelectedMemo"
      placeholder="select a memo"
      :selectedValue="selectedMemo"
      :options="memoOptions"
  />
</template>

<script lang='ts'>
import {computed, defineComponent, onMounted} from 'vue'
import useMemos from "@api/hooks/transactions/useMemos";
import {useTransactionsStore} from "@stores/transactions";
import type {Memo} from "@types";
import SelectComponent from "@components/shared/SelectComponent.vue";

export default defineComponent({
  name: "MemoSelect",
  components: {SelectComponent},
  setup() {

    const transactionsStore = useTransactionsStore()

    const selectedMemo = computed(() => transactionsStore.getSelectedMemo);

    const {data, isLoading, isFetching, isError, error, refetch} = useMemos()

    const memoOptions = computed(() => {
      if (!data.value) {
        return []
      }
      return data.value.map((item: Memo) => ({
        value: item.Memo,
        label: item.Memo,
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

    return {
      data,
      memoOptions,
      isLoading,
      isFetching,
      isError,
      error,
      selectedMemo,
      updateSelectedMemo,
    }
  }
})
</script>

<style scoped>
</style>
