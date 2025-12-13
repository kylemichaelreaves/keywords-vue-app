<template>
  <el-select
    :model-value="props.selectedValue"
    :placeholder="props.placeholder"
    @change="props.onChange($event)"
    @clear="props.onClear"
    :disabled="props.disabled"
    clearable
    filterable
    :loading="props.loading"
    :loading-text="props.loadingText"
    :data-testid="props.dataTestId"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
      :data-testid="'option-' + option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import type { PropType } from 'vue'

const props = defineProps({
  options: {
    type: Array as PropType<Array<{ value: string; label: string }>>,
    required: true,
  },
  selectedValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onChange: {
    type: Function as PropType<(selectedValue: string) => void>,
    required: true,
  },
  onClear: {
    type: Function as PropType<(selectedValue: string) => void>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  dataTestId: {
    type: String,
    default: '',
  },
})
</script>

<style scoped></style>
