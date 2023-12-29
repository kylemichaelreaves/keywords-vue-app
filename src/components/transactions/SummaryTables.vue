<template>


</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from 'vue'
import MonthsSummaryTable from "@components/transactions/MonthsSummaryTable.vue";
import NavigationButtonGroup from "@components/shared/NavigationButtonGroup.vue";
import {ArrowLeft} from "@element-plus/icons-vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import MJSummaryTable from "@components/transactions/MJSummaryTable.vue";
import OFSummaryTable from "@components/transactions/OFSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name:
      "SummaryTables",
  components:
      {
        OFSummaryTable,
        MJSummaryTable,
        ElCard,
        ElStatistic,
        ElTable,
        ElTableColumn,
        ArrowLeft,
        NavigationButtonGroup,
        MonthsSummaryTable,
        MonthSummaryTable,
        WeekSummaryTable,

      }
  ,
  setup() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const months = computed(() => store.getMonths)

    onMounted(() => {
      store.getMonths
    })

    return {
      months,
      selectedMonth,
      store
    }
  }

})

</script>


<style scoped>

</style>