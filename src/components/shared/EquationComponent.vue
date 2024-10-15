<template>
  <div>
    <div ref="equation"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import type {PropType} from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default defineComponent({
  name: 'EquationRenderer',
  props: {
    equation: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const equationRef = ref<HTMLDivElement | null>(null);

    const renderEquation = () => {
      if (equationRef.value) {
        katex.render(props.equation, equationRef.value, {
          throwOnError: false
        });
      }
    };

    onMounted(() => {
      renderEquation();
    });

    return {
      equationRef
    };
  }
});
</script>

<style scoped>
</style>
