<template>
  <svg ref="svg" :width="width" :height="height"/>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, watchEffect, onBeforeUnmount } from 'vue';
import type { Summary, DailyInterval } from "@types";
import { createLineChart } from "./createLineChart";

const LineChart = defineComponent({
  name: 'LineChart',
  props: {
    summaries: {
      type: Array as () => Summary[] | DailyInterval[],
      default: () => [],
    },
  },
  setup(props: { summaries: Summary[] }) {
    const svg = ref<SVGSVGElement | null>(null);
    const width = ref(0);
    const height = ref(150);

    // update the width based on the parent container's width
    const resizeObserver = new ResizeObserver(() => {
      if (svg.value && svg.value.parentElement) {
        width.value = svg.value.parentElement.getBoundingClientRect().width;
        if (width.value > 0 && props.summaries.length) {
          createLineChart(svg.value, props.summaries);
        }
      }
    });

    // initial draw
    onMounted(() => {
      if (svg.value) {
        resizeObserver.observe(svg.value.parentElement as Element);  // observing the parent container for resizing
        if (svg.value && props.summaries.length) {
          width.value = svg.value.parentElement?.getBoundingClientRect().width || 0;
          createLineChart(svg.value, props.summaries);
        }
      }
    });

    watchEffect(() => {
      // redraw the chart if the summaries change
      if (svg.value && props.summaries.length) {
        createLineChart(svg.value, props.summaries);
      }
    });

    // disconnect the resize observer when the component is unmounted
    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });

    return { svg, width, height };
  },
});
export default LineChart;
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
}
</style>
