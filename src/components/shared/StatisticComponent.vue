<template>
  <div>
    <el-statistic size="large" :value="value" :title="title" />
    <div v-if="previousValue !== undefined && difference" class="footer">
      <span v-if="difference > 0" class="increase">Increase</span>
      <span v-else-if="difference < 0" class="decrease">Decrease</span>
      <span v-else>No Change</span>
      <span>from last period: {{ Math.abs(difference) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  previousValue: {
    type: [Number, String],
    required: false
  },
  size: {
    type: String,
    default: 'large',
    required: false
  },
  dataTestId: {
    type: String,
    default: '',
    required: false
  },
})


const difference = computed(() => {
  if (props.previousValue !== undefined) {
    return Number(props.value) - Number(props.previousValue)
  }
  return null
})


</script>

<style scoped>
</style>