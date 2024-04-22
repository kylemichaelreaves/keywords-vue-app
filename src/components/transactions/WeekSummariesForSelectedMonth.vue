<template>
  <TableComponent
      columns=""
      :table-data="data"
      :isError="isError"
      :refetch="refetch"
      :isFetching="isFetching"
      :isLoading="isLoading"
      :error="error"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import useWeekSummariesForSelectedMonth from "@api/hooks/transactions/useWeekSummariesForSelectedMonth";
import TableComponent from "@components/shared/TableComponent.vue";

export default defineComponent({
  name: "WeekSummariesForSelectedMonth",
  components: {
    TableComponent
  },
  setup() {

    const {data, isError, refetch, isFetching, isLoading, error} = useWeekSummariesForSelectedMonth()

    return {
      data, isError, refetch, isFetching, isLoading, error
    }
  }
})

</script>


<style scoped>

</style>