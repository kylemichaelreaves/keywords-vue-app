<template>
  <el-alert
    :title="props.title"
    :type="props.type"
    :closable="true"
    :show-icon="true"
    :center="true"
    :description="props.message"
    @close="props.close"
    :data-testid="props.dataTestId"
  >
    <template #title>
      <span :data-testid="`${props.dataTestId}-title`">{{ props.title }}</span>
    </template>

    <template #default>
      <span :data-testid="`${props.dataTestId}-message`">{{ props.message }}</span>
    </template>
  </el-alert>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  close: {
    type: Function as PropType<() => void>,
    required: false,
  },
  dataTestId: {
    type: String,
    default: 'alert',
    required: false,
  },
})
</script>

<style scoped></style>
