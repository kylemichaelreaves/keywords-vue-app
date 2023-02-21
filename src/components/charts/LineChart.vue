<template>
  <svg ref="svg"/>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent} from 'vue';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  amount: number;
}

const LineChart = defineComponent({
  name: 'LineChart',
  props: {
    debitsByDay: {
      type: Array as () => { date: string; amount: number }[],
      default: () => [],
    },
  },
  setup(props: { debitsByDay: { date: string; amount: number }[] }) {
    const svg = ref<SVGSVGElement | null>(null);

    onMounted(() => {

      const data = props.debitsByDay.map(({date, amount}: { date: string, amount: number }) => ({
        date: d3.timeParse('%m/%d/%Y')(date) as Date,
        amount,
      })) as DataPoint[];

      const margin = {top: 20, right: 30, bottom: 30, left: 40};
      const width = 900 - margin.left - margin.right;
      const height = 400;

      const x = d3
          .scaleTime()
          .range([0, width])
          .domain(d3.extent(data, (d) => d.date) as [Date, Date]);

      const [minAmount, maxAmount] = d3.extent(data, (d) => d.amount) as [number, number];

      const y = d3.scaleLinear().range([height, 0]).domain([0, minAmount]);

      const line = d3
          .line<DataPoint>()
          .x((d) => x(d.date))
          .y((d) => y(d.amount));

      const xAxis = d3.axisBottom(x);

      const yAxis = d3.axisLeft(y);

      const svgElement = d3
          .select(svg.value)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      svgElement
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr('d', line);

      svgElement
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height})`)
          .call(xAxis)
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-45)');

      svgElement.append('g').attr('class', 'y-axis').call(yAxis);

      svgElement
          .append('text')
          .attr('x', width / 2)
          .attr('y', 0 - margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('fill', 'steelblue')
          .style('font-size', '16px')
          .text('Debits by Day');
    })

    return {svg};
  },
});
export default LineChart;

</script>

<style scoped>
</style>

