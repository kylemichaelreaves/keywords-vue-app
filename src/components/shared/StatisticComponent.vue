<template>
  <div :class="sizeClass">
    <el-statistic :value="value" :title="title" />
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
    default: 'default',
    required: false,
    validator: (value: string) => ['small', 'default', 'large'].includes(value)
  },
  dataTestId: {
    type: String,
    default: '',
    required: false
  },
})

const sizeClass = computed(() => {
  return `statistic-${props.size}`
})

const difference = computed(() => {
  if (props.previousValue !== undefined) {
    return Number(props.value) - Number(props.previousValue)
  }
  return null
})
</script>

<style scoped>
/* Small size */
.statistic-small :deep(.el-statistic__content) {
  font-size: 18px !important;
}

.statistic-small :deep(.el-statistic__head) {
  font-size: 12px !important;
  margin-bottom: 4px !important;
}

/* Default size */
.statistic-default :deep(.el-statistic__content) {
  font-size: 24px !important;
}

.statistic-default :deep(.el-statistic__head) {
  font-size: 14px !important;
  margin-bottom: 6px !important;
}

/* Large size */
.statistic-large :deep(.el-statistic__content) {
  font-size: 32px !important;
}

.statistic-large :deep(.el-statistic__head) {
  font-size: 16px !important;
  margin-bottom: 8px !important;
}

.footer {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.increase {
  color: #67c23a;
}

.decrease {
  color: #f56c6c;
}
</style>
