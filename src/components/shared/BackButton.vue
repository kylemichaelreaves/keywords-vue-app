<template>
  <el-button id="back-button" type='primary' @click="goBack" :data-test-id="props.dataTestId">Go Back</el-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const props = defineProps({
  dataTestId: {
    type: String,
    default: '',
    required: false
  }
})

</script>

<style scoped>
</style>