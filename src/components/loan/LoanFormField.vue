<template>
  <el-form-item :label="field.label" :prop="field.prop">
    <el-tooltip v-if="field.tooltip" effect="dark" :content="field.tooltip" placement="top">
      <component
        :is="inputComponent"
        v-model="fieldValue"
        :placeholder="field.placeholder"
        v-bind="inputNumberProps"
      />
    </el-tooltip>
    <component
      v-else
      :is="inputComponent"
      v-model="fieldValue"
      :placeholder="field.placeholder"
      v-bind="inputNumberProps"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LoanFormType } from '@types'

// Define the types for better type safety
interface FormField {
  label: string
  prop: keyof LoanFormType
  type: 'text' | 'number' | 'date'
  placeholder?: string
  tooltip?: string
}

// Define props with proper typing
const props = defineProps<{
  field: FormField
  modelValue: LoanFormType
}>()

// Use defineEmits for proper two-way data binding
const emit = defineEmits<{
  'update:modelValue': [value: LoanFormType]
}>()

// Computed property for the input component type
const inputComponent = computed(() => {
  switch (props.field.type) {
    case 'date':
      return 'el-date-picker'
    case 'number':
      return 'el-input-number'
    default:
      return 'el-input'
  }
})

// Computed property for input-specific props
const inputNumberProps = computed(() => {
  if (props.field.type !== 'number') {
    return {}
  }

  const baseProps = {
    min: 0,
    precision: 2,
    'controls-position': 'right' as const,
  }

  // Field-specific configurations
  switch (props.field.prop) {
    case 'loanTerm':
      return {
        'controls-position': 'right' as const,
      }
    case 'interestRate':
      return {
        ...baseProps,
        max: 100,
        step: 0.1,
      }
    default:
      return baseProps
  }
})

// Computed property for the specific field value with proper two-way binding
const fieldValue = computed({
  get() {
    return props.modelValue[props.field.prop]
  },
  set(value) {
    const updatedValue = { ...props.modelValue } as LoanFormType
    updatedValue[props.field.prop] = value as number | Date
    emit('update:modelValue', updatedValue)
  },
})
</script>
