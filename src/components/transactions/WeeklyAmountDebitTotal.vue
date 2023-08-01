<template>
  <el-statistic v-if="data" :value="data" title="Weekly Total Amount Debit" :loading="isLoading || isFetching"/>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
import {ElStatistic} from "element-plus";
import useSumAmountDebitByDate from "../../api/hooks/transactions/useSumAmountDebitByDate";
import {useTransactionsStore} from "../../stores/transactionsStore";

export default defineComponent({
  name: 'WeeklyAmountDebitTotal',
  components: {ElStatistic},
  setup() {

    const store = useTransactionsStore();

    const {data, isLoading, isFetching, isError, error, refetch} = useSumAmountDebitByDate('week', store.selectedWeek);

    watch(() => store.selectedWeek, (newValue) => {
      if (newValue) {
        refetch();
      }
    }, {immediate: true});

    return {
      data,
      isLoading,
      isFetching,
      isError,
      error,
    }
  }
})

</script>

<style scoped>

</style>