<template>
</template>

<script lang="ts">
import {defineComponent} from "vue";
const Transaction = defineComponent( {
  name: "Transaction",
  props: {
    id: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    memo: {
      type: String,
      default: ""
    },
    amount: {
      type: String,
      default: ""
    },
  },
  setup() {
    return {}
  }
});
export default Transaction;
</script>

<style scoped>
</style>