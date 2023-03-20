<template>
  <svg ref="svg"/>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent, watch, watchEffect} from 'vue';
import * as d3 from 'd3';

const TimelineBarChart = defineComponent({
  name: 'TimelineBarChart',
  props: {
    data: {
      type: Array as () => { date: string, amount: number }[],
      default: () => [],
    },
    selectedMonth: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const svg = ref<SVGSVGElement | null>(null);
    const data = ref(props.data);
    const selectedMonth = ref(props.selectedMonth);

    const redrawChart = () => {

      const margin = {top: 30, right: 30, bottom: 45, left: 40};
      const width = 900 - margin.left - margin.right;
      const height = 430 - margin.top - margin.bottom;


      const x = d3.scaleBand()
          .range([0, width])
          .domain(data.value.map((d) => d.date));

      console.log('x', x)

      const [minAmount, maxAmount] = d3.extent(data.value, (d) => d.amount) as [number, number];

      const y = d3.scaleLinear()
          .range([height, 0])
          .domain([0, minAmount]);

      const xAxis = d3.axisBottom(x);

      const yAxis = d3.axisLeft(y);

      const svgElement = d3.select(svg.value)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      svgElement.append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height})`)
          .call(xAxis)
          .selectAll('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-45)');

      svgElement.append('g')
          .attr('class', 'y-axis')
          .call(yAxis);

      svgElement.selectAll('rect')
          .data(data.value)
          .enter().append('rect')
          .attr('x', (d) => x(d.date)!)
          .attr('y', (d) => y(d.amount))
          .attr('width', x.bandwidth())
          .attr('height', (d) => height - y(d.amount))
          .attr('fill', 'steelblue')

      svgElement.append('text')
          .attr('x', width / 2)
          .attr('y', 0 - margin.top / 2)
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('fill', 'white')
          .text('Monthly Spending Timeline Chart');
    }


    watch(() => selectedMonth, (newVal, oldVal) => {
      data.value = props.data.filter((d) =>
          `${d.date.split('/')[0]}/${d.date.split('/')[1]}` === newVal.value
      );
    });

    watchEffect(() => {
      console.log('data', data.value);
    })

    onMounted(redrawChart);
    return {svg};
  }
,
})
export default TimelineBarChart;
</script>

<style>
</style>