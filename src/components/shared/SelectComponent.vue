<template>
  <el-select
      :model-value="selectedValue"
      :placeholder="placeholder"
      @update:model-value="onChange"
      :disabled="disabled"
      clearable
      filterable
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
import {defineComponent} from "vue";

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
      type: Function,
      required: true
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped>
</style>