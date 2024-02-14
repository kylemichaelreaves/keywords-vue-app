<template>
  <!--TODO use TableComponent -->
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";
import TableComponent from "@components/shared/TableComponent.vue";
import useMemosSumAmountDebits from "@api/hooks/transactions/useMemosSumAmountDebits";

export default defineComponent({
  name: 'MemoSumTableTable',
  components: {
    TableComponent
  },
  setup() {
    // TODO the navigation buttons increments or decrements the offset
    const offset = ref(0)
    const limit = ref(100)


    const {data, error, isError, isFetching, isLoading, refetch} = useMemosSumAmountDebits(limit.value, offset.value)

    // if the offset or limit changes, refetch the data
    watch([offset, limit], () => {
      refetch()
    })

    return {}
  }
})


</script>

<style scoped>
</style>