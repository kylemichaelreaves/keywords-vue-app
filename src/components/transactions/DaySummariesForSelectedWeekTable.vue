<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <el-row class="day-summaries-row">
    <el-col v-for="(dayData, index) in data" :key="index" class="day-summary-col">
      <div v-if="dayData && dayData.length > 0">
        <h3>{{ formatDate(dayData[0]?.Date) }}</h3>
        <TableComponent
            :data-testid="`day-summaries-table-${index}`"
            :columns="columns"
            :table-data="dayData"
            :is-fetching="isFetching || isLoading || isRefetching"
            :error="error"
        />
      </div>
    </el-col>
  </el-row>
</template>


<script setup lang="ts">
import {computed, watch} from 'vue'
import {useDaySummariesForSelectedWeek} from "@api/hooks/transactions/useDaySummariesForSelectedWeek";
import TableComponent from "@components/shared/TableComponent.vue";
import {DateTime} from "luxon";
import {useTransactionsStore} from "@stores/transactions";
import AlertComponent from "@components/shared/AlertComponent.vue";

const {data, isError, refetch, isFetching, isLoading, isRefetching, error} = useDaySummariesForSelectedWeek()
const store = useTransactionsStore()

const selectedWeek = computed(() => store.getSelectedWeek)


const formatDate = (dateString: string) => {
  return DateTime.fromISO(dateString, {zone: 'UTC'}).toFormat('cccc dd LLLL');
};

const allColumns = [
  {prop: 'date', label: 'Date'},
  {prop: 'memo', label: 'Memo'},
  {prop: 'amount_debit', label: 'Amount Debit'},
];

const columns = allColumns.filter(column => column.prop !== 'Date');

watch(selectedWeek, () => {
  refetch()
})

</script>

<style scoped>
h3 {
  font-variant: titling-caps;
  font-variant-caps: small-caps;
  align-content: baseline;
  margin: 0.5em 0.5em 0.5em 0;
}

.day-summaries-row {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: auto;
  justify-content: start;
}

.day-summary-col {
  flex: 0 0 auto;
}
</style>
