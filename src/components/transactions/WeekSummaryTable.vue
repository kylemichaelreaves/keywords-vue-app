<template>
  <el-card>
    <!-- TODO instead of headers, maybe have Week#, startedOn, endedOn -->
    <el-row>
      <el-col>
        <el-table
            v-if='weekSummaryData'
            :data="weekSummaryData"
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
      <el-col>
        <WeeklyAmountDebitTotal/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, type Ref, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useWeekSummary from "@api/hooks/transactions/useWeekSummary";
import WeeklyAmountDebitTotal from "./WeeklyAmountDebitTotal.vue";
import type {WeekSummary} from "@types";

export default defineComponent({
  name: "WeekSummaryTable",
  components: {
    ElCard,
    ElStatistic,
    ElTable,
    ElTableColumn,
    WeeklyAmountDebitTotal
  },
  setup(): {
    weekSummaryData: WeekSummary[] | undefined,
    isError: Ref<boolean>,
    refetch: () => void,
    isFetching: Ref<boolean>,
    isLoading: Ref<boolean>,
    error: unknown,
    columns: { prop: string; label: string }[]
  } {
    const store = useTransactionsStore()

    const selectedWeek = computed(() => store.getSelectedWeek)

    const {data, isError, refetch, isFetching, isLoading, error} = useWeekSummary()
    const weekSummaryData = data.value

    const weeks = computed(() => store.getWeeks)

    const isFirstWeek = computed(() => {
      return weeks.value[0].week_year === selectedWeek.value
    })

    const isLastWeek = computed(() => {
      return weeks.value[weeks.value.length - 1].week_year === selectedWeek.value
    })


    const columns = [
      {prop: 'memo', label: 'Memo'},
      {prop: 'total_debit_amount', label: 'Weekly Amount Debit'},
    ];

    watch(() => store.selectedWeek, () => {
      refetch();
    });

    return {weekSummaryData, isError, refetch, isFetching, isLoading, error, columns}
  }
})
</script>

<style scoped>
</style>