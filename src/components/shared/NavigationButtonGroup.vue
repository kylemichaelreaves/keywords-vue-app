<template>
  <el-button-group>
    <el-button type="primary" :icon="ArrowLeft.value" @click="props.goToPrevious($event)" :disabled="props.isLast">
      Previous
    </el-button>
    <el-button type="primary" :icon="ArrowRight.value" @click="props.goToNext($event)" :disabled="props.isFirst">
      Next
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {ElButton, ElButtonGroup} from "element-plus";


const props = defineProps({
  goToPrevious: {
    type: Function,
    required: true
  },
  goToNext: {
    type: Function,
    required: true
  },
  isFirst: {
    type: Boolean,
    required: true
  },
  isLast: {
    type: Boolean,
    required: true
  }
})
</script>


<style scoped>
</style>