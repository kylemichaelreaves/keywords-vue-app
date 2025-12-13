<template>
  <el-button-group :data-testid="props.dataTestId">
    <el-button
      type="primary"
      :icon="ArrowLeft"
      @click="props.goToPrevious($event)"
      :disabled="props.isLast"
    >
      Previous {{ props.label }}
    </el-button>
    <el-button
      type="primary"
      :icon="ArrowRight"
      @click="props.goToNext($event)"
      :disabled="props.isFirst"
    >
      Next {{ props.label }}
    </el-button>
    <el-button v-if="props.reset" type="info" @click="props.reset($event)" :icon="Close">
      Reset {{ props.label }}
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue'
import { ElButton, ElButtonGroup } from 'element-plus'

const props = defineProps({
  goToPrevious: {
    type: Function,
    required: true,
  },
  goToNext: {
    type: Function,
    required: true,
  },
  reset: {
    type: Function,
    required: false,
  },
  isFirst: {
    type: Boolean,
    required: true,
  },
  isLast: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  dataTestId: {
    type: String,
    default: '',
    required: false,
  },
})
</script>

<style scoped></style>
