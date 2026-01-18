<template>
  <div class="time-selector">
    <el-check-tag
      v-for="option in options"
      :key="option.value"
      :checked="modelValue === option.value"
      @change="(checked) => handleChange(option.value, checked)"
    >
      {{ option.label }}
    </el-check-tag>
  </div>
</template>

<script setup lang="ts">
import { ElCheckTag } from 'element-plus'

const modelValue = defineModel<string>({ default: 'monthly' })

const options = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const handleChange = (value: string, checked: boolean) => {
  if (checked) {
    modelValue.value = value
  }
}
</script>

<style scoped>
.time-selector {
  display: flex;
  gap: 8px;
}
</style>
