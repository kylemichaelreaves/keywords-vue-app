<template>
  <el-table :data="displayData" style="width: 100%" border>
    <el-table-column
        v-for="(value, key) in transaction"
        :key="key"
        :prop="key"
        :label="key"
    />
  </el-table>
</template>

<script lang="ts">
import {defineComponent, watchEffect} from "vue";
import type {TransactionData} from "@/types"


export default defineComponent({
  name: "Transaction",
  props: {
    transaction: {
      type: Object as () => TransactionData,
      required: true,
    },
  },
  setup(props) {
    const displayData = [props.transaction];

    // watch for changes to the transaction prop
    // and update the displayData
    watchEffect(() => {
      displayData[0] = props.transaction;
    });

    return {displayData};
  },
});
</script>
<style>
</style>