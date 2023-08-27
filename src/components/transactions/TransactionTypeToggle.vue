<template>
  <el-radio-group v-model="selectedType" size="small" data-testid="transaction-type-toggle" @change="updateSelectedType">
    <el-radio-button label="Amount Debit" name="debit">Amount Debit</el-radio-button>
    <el-radio-button label="Amount Credit" name="credit">Amount Credit</el-radio-button>
  </el-radio-group>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ElRadioGroup, ElRadioButton} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: "TransactionTypeToggle",
  components: {ElRadioGroup, ElRadioButton},
  setup() {

    // the selectedType can either be 'debit' or 'credit'
    const store = useTransactionsStore()

    // updateSelectedType is called when the user clicks on a radio button
    const updateSelectedType = (type: string) => {
      store.setSelectedType(type)
    }

    return {
      selectedType: store.selectedType,
      updateSelectedType
    }
  }
})

</script>


<style scoped>

</style>