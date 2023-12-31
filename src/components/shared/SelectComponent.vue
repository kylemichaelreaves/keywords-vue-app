<template>
  <el-select
      :model-value="selectedValue"
      :placeholder="placeholder"
      @change:model-value="onChange"
      :disabled="disabled"
      clearable
      filterable
      :loading="loading"
      :loading-text="loadingText"
  >
    <el-option
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :data-test="'option-' + option.value"
    />
  </el-select>
</template>

<script lang="ts">
import {ElOption, ElSelect} from "element-plus";
import {defineComponent, type PropType} from "vue";

export default defineComponent({
  name: "SelectComponent",
  components: {ElSelect, ElOption},
  props: {
    options: {
      type: Array as () => Array<{ value: string; label: string }>,
      required: true
    },
    selectedValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onChange: {
      type: Function as PropType<(selectedValue: string) => void>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: false,
    },
    loadingText: {
      type: String,
      default: 'Loading...',
      required: false,
},
  },
  setup() {
    return {}
  }
})
</script>

<style scoped>
</style>