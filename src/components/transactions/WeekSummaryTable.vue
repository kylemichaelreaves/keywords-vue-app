<template>
  <el-card>
    <template #header>
      <el-text size="large">Week Summary for: {{ selectedWeek }}</el-text>
      <br/>
      <el-text size="default">From {{getWeekRange(selectedWeek).startDate}} To {{getWeekRange(selectedWeek).endDate}}</el-text>
      <div class="header-container">
        <div class="header-left">
          <h2 v-if="selectedWeek">
            {{ selectedWeek }}
          </h2>
          <el-button round type="info" :icon="Close" @click="resetSelectedWeek"/>
        </div>
        <div class="header-right">
          <el-button-group>
            <el-button
                type="primary"
                :icon="ArrowLeft"
                @click="goToPreviousWeek"
                :disabled="isLastWeek"
            >
              Previous Week
            </el-button>
            <el-button
                type="primary"
                :icon="ArrowRight"
                @click="goToNextWeek"
                :disabled="isFirstWeek"
            >
              Next Week
            </el-button>
            <el-button
                type="info"
                @click="resetSelectedWeek"
                :icon="Close"
            />
          </el-button-group>
        </div>
      </div>
    </template>
    <DaySummariesForSelectedWeekTable/>
    <el-row>
      <el-col>
        <!--        TODO use shared TableComponent -->
        <el-table
            v-if='data'
            :data="data"
            table-layout="auto"
            size="large"
            v-loading="isFetching || isLoading || isRefetching"
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
import {computed, defineComponent, onMounted, onUnmounted, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useWeekSummary from "@api/hooks/transactions/useWeekSummary";
import WeeklyAmountDebitTotal from "./WeeklyAmountDebitTotal.vue";
import {ArrowLeft, ArrowRight, Close} from "@element-plus/icons-vue";
import DaySummariesForSelectedWeekTable from "@components/transactions/DaySummariesForSelectedWeekTable.vue";
import TableComponent from "@components/shared/TableComponent.vue";
import {getWeekRange} from "@api/helpers/getWeekRange";

export default defineComponent({
  name: "WeekSummaryTable",
  methods: {getWeekRange},
  computed: {
    ArrowRight() {
      return ArrowRight
    },
    ArrowLeft() {
      return ArrowLeft
    },
    Close() {
      return Close
    }
  },
  components: {
    TableComponent,
    DaySummariesForSelectedWeekTable,
    ElCard,
    ElStatistic,
    ElTable,
    ElTableColumn,
    WeeklyAmountDebitTotal
  },
  setup() {
    const store = useTransactionsStore()

    const selectedWeek = computed(() => store.getSelectedWeek)

    const {data, isError, refetch, isFetching, isLoading, isRefetching, error} = useWeekSummary()

    const weeks = computed(() => store.getWeeks)

    const firstWeek = weeks.value[0].week_year
    const lastWeek = weeks.value[weeks.value.length - 1].week_year

    const isFirstWeek = computed(() => {
      return firstWeek === selectedWeek.value
    })

    const isLastWeek = computed(() => {
      return lastWeek === selectedWeek.value
    })

    const adjustSelectedWeek = (adjustment: number) => {
      const selectedWeek = store.getSelectedWeek;
      const weeks = store.getWeeks;

      if (selectedWeek && weeks.some(week => week.week_year === selectedWeek)) {
        const currentIndex = weeks.findIndex(week => week.week_year === selectedWeek);
        const newIndex = currentIndex + adjustment;

        if (newIndex >= 0 && newIndex < weeks.length) {
          const adjustedWeek = weeks[newIndex].week_year;
          store.setSelectedWeek(adjustedWeek);
        }
      }
    };

    const goToPreviousWeek = () => {
      adjustSelectedWeek(1);
    };

    const goToNextWeek = () => {
      adjustSelectedWeek(-1);
    };


    const resetSelectedWeek = () => {
      store.setSelectedWeek('');
    }

    const columns = [
      {prop: 'memo', label: 'Memo'},
      {prop: 'total_amount_debit', label: 'Weekly Amount Debit'},
    ];

    watch(() => store.selectedWeek, () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    })

    onUnmounted(() => {
      store.setDaysForSelectedWeek([])
    })

    return {
      data,
      isError,
      refetch,
      isFetching,
      isLoading,
      isRefetching,
      error,
      columns,
      selectedWeek,
      resetSelectedWeek,
      goToNextWeek,
      goToPreviousWeek,
      isFirstWeek,
      isLastWeek,
      weeks
    }
  }
})
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>