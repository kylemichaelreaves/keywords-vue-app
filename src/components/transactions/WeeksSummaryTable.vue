<template>
  <el-card>
    <el-table
        v-if="data && data.length > 0"
        v-loading="isFetching || isLoading || isRefetching"
        :data="data"
        :row-key="data[0].period"
        stripe
        border
        style="width: 100%">
      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
      />
    </el-table>
  </el-card>

</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {ElCard, ElTable, ElTableColumn} from "element-plus";
import useSummaries from "@api/hooks/transactions/useSummaries";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: "WeeksSummaryTable",
  components: {
    ElCard,
    ElTable,
    ElTableColumn
  },
  setup() {

    const store = useTransactionsStore()

    const {data, isError, refetch, isFetching, isLoading, isRefetching, error, isRefetchError} = useSummaries()

    const columns = [
      {prop: 'period', label: 'Period'},
      {prop: 'totalDebit', label: 'Total Amount Debit'},
      {prop: 'totalCredit', label: 'Total Amount Credit'},
      {prop: 'amountDifference', label: 'Amount Difference'},
    ];

    onMounted(() => {
      refetch();
      if (data.value) {
        store.setWeeksSummaries(data.value)
      }
    })

    return {
      data, isError, refetch, isFetching, isRefetching, isLoading, error, columns
    }
  }
})
</script>

<style scoped>
</style>