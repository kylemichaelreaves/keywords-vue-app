<template>
  <svg ref="svg" height="400" width="400"/>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent} from 'vue';
import * as d3 from 'd3';
import { PieChartData } from '@/types';

const PieChart = defineComponent( {
  name: 'PieChart',
  props: {
    chartData: {
      type: Array as () => PieChartData[],
      default: () => [],
    },
  },
  setup(props: { chartData: PieChartData[]}) {
    const svg = ref<SVGSVGElement | null>(null);

    onMounted(() => {
      const data = props.chartData;
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;
      const color = d3.scaleOrdinal<string>()
          .range(d3.schemeCategory10);

      const pie = d3.pie<PieChartData>()
          .value((d) => d.value);

      const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
          .outerRadius(radius - 10)
          .innerRadius(0);

      const pieData = pie(data);

      const svgElement = d3.select(svg.value)
          .attr('width', width)
          .attr('height', height);

      const g = svgElement.append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

      const arcPath = g.selectAll('path')
          .data(pieData)
          .enter().append('path')
          .attr('fill', (d) => color(d.data.label)!)
          .attr('d', arc);

      const text = g.selectAll('text')
          .data(pieData)
          .enter().append('text')
          .attr('transform', (d) => `translate(${arc.centroid(d)})`)
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .text((d) => d.data.label);

      svgElement.append('text')
          .attr('x', width / 2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .text('Pie Chart');
    });
    return {
      svg,
    };
  },
});
export default PieChart;
</script>
