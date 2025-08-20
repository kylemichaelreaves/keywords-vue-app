<template>
  <el-switch
    v-model="themeStore.isDarkMode"
    class="theme-toggle"
    :active-icon="Moon"
    :inactive-icon="Sunny"
    active-color="#409EFF"
    inactive-color="#E6A23C"
    :data-testid="props.dataTestId"
  />
</template>

<script setup lang="ts">
import { ElSwitch } from 'element-plus'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useThemeStore } from '@stores/theme'

const themeStore = useThemeStore()

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'theme-toggle'
  }
})
</script>

<style scoped>
.theme-toggle {
  margin: 0 1rem;
}
</style>
