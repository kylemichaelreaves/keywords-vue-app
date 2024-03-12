<template>
  <TableComponent
      :table-data="data"
      :isLoading="isLoading"
      :isFetching="isFetching"
      :error="error"
      :isError="isError"
      :columns="memoColumns"
  />

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import TableComponent from "@components/shared/TableComponent.vue";
import useMemos from "@api/hooks/transactions/useMemos";

export default defineComponent({
  name: 'MemosTable',
  components: {
    TableComponent,
  },
  setup() {



    const {data, isLoading, isFetching, error, isError} = useMemos();

    const memoColumns = [
      {prop: 'Memo', label: 'Memo'},
      {prop: 'Budget Category', label: 'Budget Category'}
    ]

    return {
      data,
      isLoading,
      isFetching,
      error,
      isError,
      memoColumns
    }
  }
})

</script>
<style scoped>

</style>