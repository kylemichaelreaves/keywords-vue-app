<template>
  <svg ref="svg" :width="width" :height="height"/>
</template>

<script setup lang="ts">
import {ref, onMounted, watchEffect, onBeforeUnmount} from 'vue';
import type {Summary, DailyInterval} from "@types";
import {createLineChart} from "./createLineChart";

const props = defineProps<{
  summaries: Summary[] | DailyInterval[],
  handleOnClickSelection: (selection: string) => void,
}>();

const svg = ref<SVGSVGElement | null>(null);

const width = ref(0);
const height = ref(150);

// update the width based on the parent container's width
const resizeObserver = new ResizeObserver(() => {
  if (svg.value && svg.value.parentElement) {
    width.value = svg.value.parentElement.getBoundingClientRect().width;
    if (width.value > 0 && props.summaries.length) {
      createLineChart(svg.value, props.summaries, props.handleOnClickSelection);
    }
  }
});

// the initial draw upon mounting
onMounted(() => {
  if (svg.value) {
    resizeObserver.observe(svg.value.parentElement as Element);  // observing the parent container for resizing
    if (svg.value && props.summaries.length) {
      width.value = svg.value.parentElement?.getBoundingClientRect().width || 0;
      createLineChart(svg.value, props.summaries, props.handleOnClickSelection);
    }
  }
});

watchEffect(() => {
  // redraw the chart if the summaries change
  if (svg.value && props.summaries.length) {
    createLineChart(svg.value, props.summaries, props.handleOnClickSelection);
  }
});

// disconnect the resize observer when the component is unmounted
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});


</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
}
</style>
