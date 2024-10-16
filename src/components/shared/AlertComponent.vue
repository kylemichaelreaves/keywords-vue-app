<template>
  <el-alert
      :title="props.title"
      :type="props.type"
      :closable="true"
      :show-icon="true"
      :center="true"
      :description="props.type + props.message"
  />
</template>

<script setup lang="ts">
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
  }
})

</script>

<style scoped>
</style>