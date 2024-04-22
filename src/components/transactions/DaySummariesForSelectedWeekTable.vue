<template>
  <h4>Day Summaries for Selected Week</h4>
  <el-text size="large" type="warning">Note:</el-text>
  <el-text>
    The date of a transaction corresponds to the date when the transaction cleared and not the date when it was
    posted (the actual date of the transaction).
  </el-text>
  <!--  TODO the calendar should display the Sum Amount for each day of the selectedWeek -->
  <!--  TODO if the date is click, a modal displays the DaySummary table for the clicked date -->
  <el-calendar
      :range="[selectedWeekStart, selectedWeekEnd]"
      @click="handleCalendarClick"
  >
    <template #date-cell="{data}">
      <div @click="openModal(data.day)">
        <span>{{ data.day }}</span>
        <span v-if="getAmountDebitForDay(data.day) !== null">Debit: ${{ getAmountDebitForDay(data.day) }}</span>
      </div>
    </template>
  </el-calendar>

  <!-- Modal for Day Details -->
  <el-dialog
      :visible.sync="isModalVisible"
      title="Day Summary Details"
      width="60%"
      @close="handleClose">
    <TableComponent
        v-if="selectedDateDetails"
        :columns="columns"
        :table-data="selectedDateDetails"
        :is-fetching="isFetching || isLoading || isRefetching"
        :error="error"
    />
  </el-dialog>


  <el-row class="day-summaries-row">
    <el-col v-for="(dayData, index) in data" :key="index" class="day-summary-col">
      <div v-if="dayData && dayData.length > 0">
        <h3>{{ formatDate(dayData[0]?.Date) }}</h3>
        <TableComponent
            :columns="columns"
            :table-data="dayData"
            :is-fetching="isFetching || isLoading || isRefetching"
            :error="error"
        />
      </div>
    </el-col>
  </el-row>
</template>


<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from 'vue'
import {useDaySummariesForSelectedWeek} from "@api/hooks/transactions/useDaySummariesForSelectedWeek";
import TableComponent from "@components/shared/TableComponent.vue";
import {DateTime} from "luxon";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: "DaySummariesForSelectedWeekTable",
  components: {
    TableComponent
  },
  setup() {
    const {data, isError, refetch, isFetching, isLoading, isRefetching, error} = useDaySummariesForSelectedWeek()
    const store = useTransactionsStore()
    const selectedWeek = computed(() => store.getSelectedWeek)
    const isModalVisible = ref(false);
    const selectedDateDetails = ref(null);

    // using luxon
    // get the date from the data object
    const selectedWeekStart = computed(() => {
      const firstDate = data.value ? data.value[0]?.Date : '';
      return DateTime.fromISO(firstDate, {zone: 'UTC'}).toJSDate();
    });

    const selectedWeekEnd = computed(() => {
      const lastDate = data.value ? data.value[data.value.length - 1]?.Date : '';
      return DateTime.fromISO(lastDate, {zone: 'UTC'}).toJSDate();
    });


    const formatDate = (dateString: string) => {
      return DateTime.fromISO(dateString, {zone: 'UTC'}).toFormat('ccc, yyyy LLL dd');
    };

// Assuming `data` is a ref and might initially be undefined
    const getAmountDebitForDay = (date: string | Date): string | null => {
      const targetDate = DateTime.fromJSDate(new Date(date)).toISODate();
      if (date < selectedWeekStart.value || date > selectedWeekEnd.value) {
        // If the date is outside the selected week, don't calculate sum
        return null;
      }
      let sum = 0;
      if (data.value) {
        for (const dailyTransactions of data.value) {
          for (const transaction of dailyTransactions) {
            if (DateTime.fromISO(transaction.Date).toISODate() === targetDate) {
              sum += transaction['Amount Debit'];
            }
          }
        }
      }
      return sum.toFixed(2); // Format the sum to two decimal places
    };

    const openModal = (date: string) => {
      if (!data.value) {
        return;
      } else if (data.value) {
        const dayData = data.value.find(d => DateTime.fromISO(d.Date).toISODate() === DateTime.fromISO(date).toISODate());
        if (dayData) {
          selectedDateDetails.value = dayData;
          isModalVisible.value = true;
        }
      }
    };

    const handleClose = () => {
      isModalVisible.value = false;
      selectedDateDetails.value = null; // Clear the selected data when closing the modal
    };


    // handleCalendarClick should open a modal displaying the DaySummary table for the clicked date
    const handleCalendarClick = (date: Date) => {
      const formattedDate = DateTime.fromJSDate(date).toISODate() as string;
      openModal(formattedDate);
    }


    const allColumns = [
      {prop: 'Date', label: 'Date'},
      {prop: 'Memo', label: 'Memo'},
      {prop: 'Amount Debit', label: 'Amount Debit'},
    ];

    const columns = allColumns.filter(column => column.prop !== 'Date');

    watch(selectedWeek, () => {
      refetch()
    })

    onMounted(() => {
      refetch()
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
      formatDate,
      selectedWeekStart,
      selectedWeekEnd,
      getAmountDebitForDay,
      handleCalendarClick,
      isModalVisible,
      openModal,
      handleClose,
      selectedDateDetails
    }
  }
})


</script>

<style scoped>
.day-summaries-row {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  justify-content: flex-start;
  align-content: center;
}

.day-summary-col {
  flex: 0 0 auto; /* Do not grow, do not shrink, and base width on content */
}
</style>
