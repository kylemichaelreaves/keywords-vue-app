<template>
  <el-form :model="transaction">
    <el-form-item
        v-for="(field, key) in fields"
        :key="key"
        :label="field.label"
    >
      <component
          :is="field.component"
          v-model="transaction[key]"
          :placeholder="field.placeholder"
      >
      </component>
    </el-form-item>
    <el-button type="primary" @click="saveTransaction">Save</el-button>
  </el-form>
</template>

<script setup lang="ts">
import {type PropType, reactive, watch} from 'vue';
import type {Transaction, TransactionKeys, TransactionFormFields} from "@types";
import mutateTransaction from "@api/hooks/transactions/mutateTransaction";
import {ElMessage} from "element-plus";

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true,
  }
});

const transaction = reactive({
  transactionNumber: props.transaction.transactionNumber,
  date: props.transaction.date,
  amountDebit: props.transaction.amountDebit,
  amountCredit: props.transaction.amountCredit,
  description: props.transaction.description,
  budgetCategory: props.transaction.budgetCategory,
  memo: props.transaction.memo,
  balance: props.transaction.balance,
  checkNumber: props.transaction.checkNumber,
  fees: props.transaction.fees,
})

const fields: Record<TransactionKeys, TransactionFormFields> = ({
  transactionNumber: {
    // TODO should be readonly, and fetch the next transaction number in the series
    component: 'el-input',
    label: 'Transaction Number',
    placeholder: 'Enter a transaction number',
  },
  date: {
    component: 'el-date-picker',
    label: 'Date',
    placeholder: 'Select a date',
  },
  amountDebit: {
    component: 'el-input',
    label: 'Debit Amount',
    placeholder: 'Enter a debit amount',
  },
  amountCredit: {
    component: 'el-input',
    label: 'Credit Amount',
    placeholder: 'Enter a credit amount',
  },
  description: {
    // TODO use DescriptionSelect; if description is not found, create a new one
    component: 'el-input',
    label: 'Description',
    placeholder: 'Enter a description',
  },
  memo: {
    // TODO use MemoSelect; if memo is not found, create a new one
    component: 'el-select',
    label: 'Memo',
    placeholder: 'Select a memo',
  },
  balance: {
    // TODO should be readonly, the calculated  balance, whether its a sum or a remainder, based on the amountDebit or amountCredit
    component: 'el-input',
    label: 'Balance',
    placeholder: 'Enter a balance',
  },
  checkNumber: {
    // TODO should be disabled if the value of DescriptionSelect is not CHECK
    component: 'el-input',
    label: 'Check Number',
    placeholder: 'Enter a check number',
  },
  budgetCategory: {
    component: 'BudgetCategoryTreeSelect',
    label: 'Budget Category',
    placeholder: 'Select a budget category',
  },
  fees: {
    component: 'el-input',
    label: 'Fees',
    placeholder: 'Enter fees',
  },
})

const {mutate} = mutateTransaction();

watch(() => props.transaction, (newTransaction) => {
  transaction.transactionNumber = newTransaction.transactionNumber;
  transaction.date = newTransaction.date;
  transaction.amountDebit = newTransaction.amountDebit;
  transaction.amountCredit = newTransaction.amountCredit;
  transaction.description = newTransaction.description;
  transaction.budgetCategory = newTransaction.budgetCategory;
  transaction.memo = newTransaction.memo;
  transaction.balance = newTransaction.balance;
  transaction.checkNumber = newTransaction.checkNumber;
  transaction.fees = newTransaction.fees;
}, {
  deep: true,
  immediate: true,
});

const saveTransaction = () => {
  mutate({
        transaction: props.transaction
      },
      {
        onSuccess: () => {
          ElMessage.success('Transaction saved');
        },
        onError: (error) => {
          ElMessage.error(error.message);
        }
      });
}

</script>

<style scoped>

</style>