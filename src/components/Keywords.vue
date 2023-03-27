<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <Key />
    </el-icon>
    Keywords
  </h2>
  <span>a component whose input is debounced at a reasonable interval so that it can return related keywords</span>
  <el-input
      id="keywords-input"
      :model-value="keywords"
      @update:model-value="updateKeywords"
      placeholder="Enter keywords"
      clearable
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

const Keywords = defineComponent({
  name: 'Keywords',
  emits: ['update:keywords'],
  setup(_, { emit }) {
    const keywords = ref('');

    const updateKeywords = (value: string) => {
      keywords.value = value;
      emit('update:keywords', value);
    };

    return { keywords, updateKeywords };
  },
});
export default Keywords;
</script>

<style scoped>
</style>
