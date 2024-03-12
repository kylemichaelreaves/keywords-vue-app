<template>
  <el-card>
    <template #header>
      <el-text>Week Summary for:</el-text>
      <div class="header-content">
        <h2 v-if="selectedWeek">
          {{ selectedWeek }}
        </h2>
        <el-button round type="info" :icon="Close" @click="resetSelectedWeek"/>
      </div>
    </template>
    <el-row>
      <el-col>
        <el-table
            v-if='data'
            :data="data"
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
import {computed, defineComponent, onMounted, type Ref, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useWeekSummary from "@api/hooks/transactions/useWeekSummary";
import WeeklyAmountDebitTotal from "./WeeklyAmountDebitTotal.vue";
import type {WeekSummary} from "@types";
import {Close} from "@element-plus/icons-vue";

export default defineComponent({
  name: "WeekSummaryTable",
  computed: {
    Close() {
      return Close
    }
  },
  components: {
    ElCard,
    ElStatistic,
    ElTable,
    ElTableColumn,
    WeeklyAmountDebitTotal
  },
  setup(): {
    data: Ref<WeekSummary[]> | Ref<undefined>,
    isError: Ref<boolean>,
    refetch: () => void,
    isFetching: Ref<boolean>,
    isLoading: Ref<boolean>,
    error: unknown,
    columns: { prop: string; label: string }[],
    selectedWeek: Ref<string>,
    resetSelectedWeek: () => void
  } {
    const store = useTransactionsStore()

    const selectedWeek = computed(() => store.getSelectedWeek)

    const {data, isError, refetch, isFetching, isLoading, error} = useWeekSummary()

    const weeks = computed(() => store.getWeeks)

    const isFirstWeek = computed(() => {
      return weeks.value[0].week_year === selectedWeek.value
    })

    const isLastWeek = computed(() => {
      return weeks.value[weeks.value.length - 1].week_year === selectedWeek.value
    })

    const resetSelectedWeek = () => {
      store.setSelectedWeek('');
    }

    const columns = [
      {prop: 'memo', label: 'Memo'},
      {prop: 'total_debit_amount', label: 'Weekly Amount Debit'},
    ];

    watch(() => store.selectedWeek, () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    })

    return {data, isError, refetch, isFetching, isLoading, error, columns, selectedWeek, resetSelectedWeek}
  }
})
</script>

<style scoped>
.header-content {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: start;
  gap: 1rem;
}
</style>