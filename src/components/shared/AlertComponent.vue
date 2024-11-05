<template>
  <el-alert
      :title="props.title"
      :type="props.type"
      :closable="true"
      :show-icon="true"
      :center="true"
      :description="props.message"
      @close="props.close"
  />
</template>

<script setup lang="ts">
import type {PropType} from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  close: {
    type: Function as PropType<() => void>,
    required: false
  }
})

</script>

<style scoped>
</style>