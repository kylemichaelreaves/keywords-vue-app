<template>
  <svg ref="svg"></svg>
</template>

<script lang="ts">
import {ref, onMounted, defineComponent, watch, computed} from 'vue';
import * as d3 from 'd3';
import {Transaction} from '../../types';

interface MemoDataPoint {
  memo: string;
  amount: number;
}


const MemoBarChart = defineComponent({
  name: 'MemoBarChart',
  props: {
    data: {
      type: Array as () => Transaction[],
      default: () => [],
    },
  },
  setup(props: { data: Transaction[] }) {
    const svg = ref<SVGSVGElement | null>(null);
    const reactiveData = ref(props.data);

    const memoSum = computed(() => {
      return reactiveData.value.reduce((memo, d) => {
        const debit = parseFloat(d['Amount Debit']);
        const memoText = d.Memo;
        if (debit && memoText) {
          memo[memoText] = (memo[memoText] || 0) + debit;
        }
        return memo;
      }, {} as { [key: string]: number });
    });

    function sumDebits(transactions: Transaction[]): number {
      return transactions.reduce((total, transaction) => {
        return total + parseFloat(transaction['Amount Debit']);
      }, 0);
    }


    const transformedData = computed(() => {
      return Object.entries(memoSum.value).map(([memo, amount]) => ({
        memo,
        amount,
      }));
    });

    onMounted(() => {
      const margin = {top: 20, right: 30, bottom: 30, left: 40};
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const x = d3
          .scaleBand()
          .range([0, width])
          .domain(transformedData.value.map((d) => d.memo));

      const y = d3
          .scaleLinear()
          .range([height, 0])
          .domain([0, d3.max(transformedData.value, (d) => d.amount) as number]);

      const xAxis = d3.axisBottom(x);

      const yAxis = d3.axisLeft(y);

      const svgElement = d3
          .select(svg.value)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

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
          .selectAll('rect')
          .data(transformedData.value)
          .enter()
          .append('rect')
          .attr('x', (d) => x(d.memo)!)
          .attr('y', (d) => y(d.amount))
          .attr('width', x.bandwidth())
          .attr('height', (d) => height - y(d.amount))
          .attr('fill', 'steelblue');

      svgElement
          .append('text')
          .attr('x', width / 2)
          .attr('y', 0 - margin.top / 2)
          .attr('text-anchor', 'middle')
          .text('Memo Spending');

      watch(reactiveData, () => {
        const memoSum = sumDebits(reactiveData.value);
        const transformedData = Object.entries(memoSum).map(([memo, amount]) => ({
          memo,
          amount,
        }));
        x.domain(transformedData.map((d) => d.memo));
        y.domain([0, d3.max(transformedData, (d) => d.amount) as number]);

        svgElement.select<SVGSVGElement>('.x-axis').call(d3.axisBottom(x)).selectAll('text').style('text-anchor', 'end').attr('transform', 'rotate(-45)');
        svgElement.select<SVGSVGElement>('.y-axis').call(d3.axisLeft(y));
        svgElement
            .selectAll('rect')
            .data(transformedData)
            .join('rect')
            .attr('x', (d) => x(d.memo)!)
            .attr('y', (d) => y(d.amount))
            .attr('width', x.bandwidth())
            .attr('height', (d) => height - y(d.amount))
            .attr('fill', 'steelblue');
      });
    });
  }
});


</script>

<style scoped>
</style>