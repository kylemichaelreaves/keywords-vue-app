<template>
  <svg ref="svg"/>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent, watchEffect} from 'vue';
import type {Summary} from "@types";
import {createLineChart} from "./createLineChart";

const LineChart = defineComponent({
      name: 'LineChart',
      props: {
        summaries: {
          type: Array as () => Summary[],
          default: () => [],
        },
      },
      // props should be the data from their respective queries
      setup(props: { summaries: Summary[] }) {
        const svg = ref<SVGSVGElement | null>(null);


        onMounted(() => {
          if (svg.value) {
            createLineChart(svg.value, props.summaries);
          }
        });

        watchEffect(() => {
          if (svg.value && props.summaries.length) {
            createLineChart(svg.value, props.summaries);
          }
        });


        return {svg};
      },
    }
);
export default LineChart;

</script>

<style scoped>
</style>

