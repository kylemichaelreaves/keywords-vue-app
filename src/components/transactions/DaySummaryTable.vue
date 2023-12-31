<template>
  <el-card>
    <el-row>
      <el-col>
        <el-table
            v-if='daySummaryData'
            :data="daySummaryData"
            table-layout="auto"
            size="large"
            :loading="isFetching"
            layout="auto"
            show-summary
        >
          <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
          />
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, type Ref, watch} from 'vue'
import {ElCard, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useDaySummary from "@api/hooks/transactions/useDaySummary"; // You need to implement this
import type {DaySummary} from "@types"; // You need to define this

export default defineComponent({
  name: "DaySummaryTable",
  components: {
    ElCard,
    ElTable,
    ElTableColumn
  },
  setup(): {
    daySummaryData: DaySummary[] | undefined,
    isError: Ref<boolean>,
    refetch: () => void,
    isFetching: Ref<boolean>,
    isLoading: Ref<boolean>,
    error: unknown,
    columns: { prop: string; label: string }[]
  } {
    const store = useTransactionsStore()

    const selectedDay = computed(() => store.getSelectedDay) // You need to implement this

    const {data, isError, refetch, isFetching, isLoading, error} = useDaySummary() // You need to implement this
    const daySummaryData = data.value

    // Generate columns based on the keys of the first object in the data array
    const columns = daySummaryData && daySummaryData[0]
        ? Object.keys(daySummaryData[0]).map(key => ({ prop: key, label: key }))
        : [];

    watch(() => store.selectedDay, () => {
      refetch();
    });

    return {daySummaryData, isError, refetch, isFetching, isLoading, error, columns, selectedDay}
  }
})
</script>

<style scoped>
</style>