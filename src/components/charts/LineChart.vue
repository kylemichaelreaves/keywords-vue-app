<template>
  <svg ref="svg"/>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent, watchEffect} from 'vue';
import {Summary} from "@types/types";
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
          console.log('Component mounted. Summaries length:', props.summaries.length);
          if (svg.value) {
            createLineChart(svg.value, props.summaries);
          }
        });

        watchEffect(() => {
          console.log('WatchEffect triggered. Summaries length:', props.summaries.length);
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

