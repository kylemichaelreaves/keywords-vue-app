<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error"/>
  <el-card>
    <template #header>
      <div class="header-container">
        <div class="header-left">
          <div>
            <el-text size="large">Week Summary for:</el-text>
            <h2>
              {{ selectedWeek }}
            </h2>
            <el-text size="large">From: {{ getWeekRange(selectedWeek).startDate }} To:
              {{ getWeekRange(selectedWeek).endDate }}
            </el-text>
          </div>
        </div>
        <WeeklyAmountDebitTotal/>
        <div class="header-right">
          <NavigationButtonGroup
              label="Week"
              :is-last="isLastWeek"
              :is-first="isFirstWeek"
              :go-to-next="goToNextWeek"
              :go-to-previous="goToPreviousWeek"
              :reset="resetSelectedWeek"
          />
        </div>
      </div>
    </template>
    <el-row :gutter="5">
      <el-col :span="14">
        <el-table
            v-if='data'
            :data="data"
            table-layout="auto"
            size="large"
            v-loading="isLoadingCondition"
            layout="auto"
            show-summary
        >
          <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
          >
            <template v-if="column.prop === 'memo'" v-slot="scope">
              <router-link :to="{ name: 'memo', params: { memoName: scope.row[column.prop] }}">
                {{ scope.row.memo }}
              </router-link>
            </template>
            <template v-else v-slot="scope">
              {{ scope.row[column.prop] }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
        <DaySummariesForSelectedWeekTable/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, watch, reactive} from 'vue'
import {ElCard, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useWeekSummary from "@api/hooks/transactions/useWeekSummary";
import WeeklyAmountDebitTotal from "./WeeklyAmountDebitTotal.vue";
import DaySummariesForSelectedWeekTable from "@components/transactions/DaySummariesForSelectedWeekTable.vue";
import {getWeekRange} from "@api/helpers/getWeekRange";
import AlertComponent from "@components/shared/AlertComponent.vue";
import NavigationButtonGroup from "@components/shared/NavigationButtonGroup.vue";

const store = useTransactionsStore()

const selectedWeek = computed(() => store.getSelectedWeek)

const {data, isError, refetch, isFetching, isLoading, isRefetching, error} = useWeekSummary()

const isLoadingCondition = reactive(isFetching || isLoading || isRefetching)

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


</script>

<style scoped>
.header-left h2 {
  font-size: 1.5rem;
  margin: 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.header-right {
  display: flex;
  align-items: center;
}
</style>