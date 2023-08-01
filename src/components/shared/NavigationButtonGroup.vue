<template>
  <el-button-group>
    <el-button type="primary" :icon="ArrowLeft.value" @click="goToPrevious" :disabled="isLast">Previous Month
    </el-button>
    <el-button type="primary" :icon="ArrowRight.value" @click="goToNext" :disabled="isFirst">Next Month
    </el-button>
  </el-button-group>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import {ElButton, ElButtonGroup} from "element-plus";

export default defineComponent({
  name: 'NavigationButtonGroup',
  components: {
    ArrowLeft,
    ArrowRight,
    ElButton,
    ElButtonGroup
  },
  props: {
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
  },
  computed: {
    ArrowRight() {
      return ArrowRight
    },
    ArrowLeft() {
      return ArrowLeft
    }
  },
})
</script>


<style scoped>
</style>