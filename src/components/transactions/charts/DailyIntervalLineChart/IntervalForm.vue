<template>
  <div :data-testid="props.dataTestId" class="interval-form">
    <AlertComponent
      title="Interval Exceeds Oldest Transaction"
      message="Your requested interval exceeds the oldest dated transaction. Please choose a smaller interval."
      type="error"
      v-if="isOutOfRange"
      @close="selectPreset(presets[0])"
    />

    <AlertComponent
      :title="error.name"
      :message="error.message"
      type="error"
      v-if="error && isError"
    />

    <el-button-group class="period-buttons" data-testid="interval-period-buttons">
      <el-button
        v-for="preset in presets"
        :key="preset.label"
        :type="activePreset === preset.value ? 'primary' : 'default'"
        :disabled="isFetching || isLoading"
        :data-testid="`interval-btn-${preset.label}`"
        @click="selectPreset(preset)"
      >
        {{ preset.label }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIsIntervalGreaterThanOldestDate } from '@api/hooks/transactions/useIsIntervalGreaterThanOldestDate.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'interval-form',
  },
})

const intervalValue = defineModel<string>('intervalValue', {
  default: '1 months',
})

const presets = [
  { label: '1M', value: '1 months' },
  { label: '3M', value: '3 months' },
  { label: '6M', value: '6 months' },
  { label: '1Y', value: '1 years' },
]

const activePreset = ref('1 months')

const computedIntervalValue = computed(() => activePreset.value)

const { data, error, isError, isLoading, isFetching } =
  useIsIntervalGreaterThanOldestDate(computedIntervalValue)

const isOutOfRange = computed(() => {
  return data?.value?.map((item: { is_out_of_range: boolean }) => item.is_out_of_range)[0]
})

function selectPreset(preset: (typeof presets)[number]) {
  activePreset.value = preset.value
  intervalValue.value = preset.value
}
</script>

<style scoped>
.interval-form {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 0.75rem;
}

.period-buttons :deep(.el-button) {
  font-weight: 500;
  font-size: 0.8125rem;
}

.period-buttons :deep(.el-button--primary) {
  --el-button-bg-color: var(--bv-primary);
  --el-button-border-color: var(--bv-primary);
  --el-button-text-color: var(--bv-primary-fg);
  --el-button-hover-bg-color: var(--bv-primary-hover);
  --el-button-hover-border-color: var(--bv-primary-hover);
}
</style>
