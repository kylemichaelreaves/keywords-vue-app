<template>
  <el-form :model="formState">
    <el-switch
        active-text="Debit"
        inactive-text="Credit"
        v-model="isDebit"
    />
    <el-form-item label="Date">
      <el-date-picker :model="formState.date"/>
    </el-form-item>
    <el-form-item label="Description">
      <el-input :model="formState.description"/>
    </el-form-item>
    <el-form-item label="Memo">
      <el-input :model="formState.memo"/>
    </el-form-item>
    <el-form-item label="Amount Debit">
      <el-input :model="formState.amountDebit" :disabled="!isDebit"/>
    </el-form-item>
    <el-form-item label="Amount Credit">
      <el-input :model="formState.amountCredit" :disabled="isDebit"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";

export default defineComponent({
  name: "TransactionForm",
  setup() {
    // formState

    const isDebit = ref(true);

    const formState = reactive({
      date: "",
      description: "",
      memo: "",
      amountDebit: "",
      amountCredit: "",
    });


    // mutateTransactions


    return {
      formState,
      isDebit,
    };
  },
});

</script>

<style scoped>


</style>