<template>
  <el-statistic
      v-if="data"
      :value="data"
      title="Monthly Total Amount Debit"
      v-loading="isLoading || isFetching || isRefetching"
  />
</template>

<script lang="ts">
import {computed, defineComponent, watch} from "vue";
import {ElStatistic} from "element-plus";
import useSumAmountDebitByDate from "@api/hooks/transactions/useSumAmountDebitByDate";
import {useTransactionsStore} from "@stores/transactions";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'MonthlyAmountDebitTotal',
  components: {ElStatistic},
  setup() {

    const route = useRoute();
    console.log('route', route);

    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth);

    const {
      data,
      isLoading,
      isFetching,
      isRefetching,
      isError,
      error,
      refetch
    } = useSumAmountDebitByDate('month', selectedMonth.value);

    watch(() => store.selectedMonth, (newValue) => {
      if (newValue) {
        refetch();
      }
    }, {immediate: true});

    return {
      data,
      isLoading,
      isFetching,
      isRefetching,
      isError,
      error,
    }
  }
})

</script>

<style scoped>

</style>