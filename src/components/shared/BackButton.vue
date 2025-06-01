<template>
  <el-button id="back-button" type='primary' @click="goBack">Go Back</el-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

</script>

<style scoped>
</style>