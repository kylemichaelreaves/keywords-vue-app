<template>
  <el-card style="width: 35vw">
    <h2>Loan Calculator</h2>

    {{ loanEstimate }}

    <el-form :ref="ruleFormRef" :model="loanForm" label-width="120px" :rules="rules">
      <loan-form-field v-for="(field, index) in loanFormFields" :key="index" :field="field" :model="loanForm" />
      <el-form-item>
        <!--        TODO Calculate should be disabled until the number fields are different from its initial state-->
        <el-button type="primary" @click="calculateLoanEstimate" :disabled="isFormInItsInitialState">Calculate
        </el-button>
        <el-button type="primary" @click="resetForm" :disabled="isFormInItsInitialState">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onUpdated, reactive, ref } from 'vue'
import type { LoanFormType } from '@types'
import LoanFormField from '@components/loan/LoanFormField.vue'
import type { FormInstance, FormRules } from 'element-plus'


const ruleFormRef = ref<FormInstance>()

const loanEstimateColumns = [
  { prop: 'monthlyPayment', label: 'Monthly Payment' },
  { prop: 'totalInterest', label: 'Total Interest' },
  { prop: 'totalCost', label: 'Total Cost' },
  { prop: 'payoffDate', label: 'Payoff Date' }
]

type LoanEstimateType = {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  payoffDate: number;
};

const loanEstimate: LoanEstimateType = reactive({
  monthlyPayment: 0,
  totalInterest: 0,
  totalCost: 0,
  payoffDate: Date.now()
})

const isLoanEstimateCalculated = computed(() => {
  return loanEstimate.monthlyPayment !== 0 ||
    loanEstimate.totalInterest !== 0 ||
    loanEstimate.totalCost !== 0 ||
    loanEstimate.payoffDate !== Date.now()
})

const initialLoanFormState: LoanFormType = {
  loanAmount: 0,
  interestRate: 0,
  loanTerm: 0,
  startDate: new Date()
}

const isFormInItsInitialState = computed(() => {
  return loanForm.loanAmount === initialLoanFormState.loanAmount &&
    loanForm.interestRate === initialLoanFormState.interestRate &&
    loanForm.loanTerm === initialLoanFormState.loanTerm
})

const loanForm: LoanFormType = reactive({ ...initialLoanFormState })

const hasFormChanged = computed(() => {
  return loanForm.loanAmount !== 0 ||
    loanForm.interestRate !== 0 ||
    loanForm.loanTerm !== 0 ||
    loanForm.startDate !== new Date()
})

// const isFormInItsInitialState = computed(() => {
//   return loanForm.loanAmount === initialLoanFormState.loanAmount &&
//       loanForm.interestRate === initialLoanFormState.interestRate &&
//       loanForm.loanTerm === initialLoanFormState.loanTerm &&
//       loanForm.startDate.toDateString() === initialLoanFormState.startDate.toDateString();
// });

const loanFormFields = [
  { label: 'Loan Amount', prop: 'loanAmount', placeholder: 'Enter loan amount', type: 'number' },
  {
    label: 'Interest Rate',
    prop: 'interestRate',
    placeholder: 'Enter interest rate',
    type: 'number',
    tooltip: 'Annual Interest Rate as a Percentage'
  },
  {
    label: 'Loan Term',
    prop: 'loanTerm',
    placeholder: 'Enter loan term',
    type: 'number',
    tooltip: 'Total Months of the Loan'
  },
  { label: 'Start Date', prop: 'startDate', placeholder: 'Select start date', type: 'date' }
]

const rules = reactive<FormRules<LoanFormType>>({
  loanAmount: [
    { required: true, message: 'Please enter the loan amount', trigger: 'blur' }
  ],
  interestRate: [
    { required: true, message: 'Please enter the interest rate', trigger: 'blur' }
  ],
  loanTerm: [
    { required: true, message: 'Please enter the loan term', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: 'Please select the start date', trigger: 'change' }
  ]
})

const calculateLoanEstimate = () => {
  // P = [r*PV] / [1 - (1 + r)^-n]
  // P = monthly payment
  // r = monthly interest rate
  // PV = present value (loan amount)
  // n = number of payments

  // Convert interest rate from percentage to a decimal and then divide by 12 for monthly rate
  const monthlyInterestRate = loanForm.interestRate / 100 / 12
  const numberOfPayments = loanForm.loanTerm

  // Calculate monthly payment
  loanEstimate.monthlyPayment = (monthlyInterestRate * loanForm.loanAmount) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))

  // Calculate total interest
  loanEstimate.totalInterest = (loanEstimate.monthlyPayment * numberOfPayments) - loanForm.loanAmount

  // Calculate total cost
  loanEstimate.totalCost = loanForm.loanAmount + loanEstimate.totalInterest

  // Calculate payoff date
  const startDate = new Date(loanForm.startDate)
  startDate.setMonth(startDate.getMonth() + numberOfPayments)
  loanEstimate.payoffDate = startDate.getTime()
  console.log('calculateLoanEstimate = () => loanEstimate:', loanEstimate)
}

const resetForm = () => {
  loanForm.loanAmount = initialLoanFormState.loanAmount
  loanForm.interestRate = initialLoanFormState.loanAmount
  loanForm.loanTerm = initialLoanFormState.loanTerm
  loanForm.startDate = initialLoanFormState.startDate
}


onUpdated(() => {
  console.log('loanForm', loanForm)
  console.log('loanEstimate', loanEstimate)
  console.log('isLoanEstimateCalculated', isLoanEstimateCalculated.value)
})


</script>

<style scoped>
</style>