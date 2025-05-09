import * as d3 from 'd3'
import type { Ref } from 'vue'

export const createBarChart = (
  chartContainer: Ref<HTMLElement | null>,
  data: Ref<{ month: string; amount: number }[]>,
  width: Ref<number>,
  height: Ref<number>,
  margin: { top: number; right: number; bottom: number; left: number },
  maxAmount: Ref<number>,
  thresholdValue: Ref<number>,
  popoverVisible: Ref<boolean>,
  popoverPosition: { x: number; y: number },
  selectedMonth: Ref<{ month: string; amount: number } | null>,
  svg: Ref<d3.Selection<SVGGElement, unknown, null, undefined> | null>,
  xScale: Ref<d3.ScaleBand<string> | null>,
  yScale: Ref<d3.ScaleLinear<number, number> | null>,
  thresholdLine: Ref<d3.Selection<SVGLineElement, unknown, null, undefined> | null>
) => {
  if (!chartContainer.value) return

  // TABULA RASA!
  d3.select(chartContainer.value).selectAll('*').remove()

  // SVG
  const svgElement = d3.select(chartContainer.value)
    .append('svg')
    .attr('width', width.value + margin.left + margin.right)
    .attr('height', height.value + margin.top + margin.bottom)

  // Append a group element and store the reference
  svg.value = svgElement.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  // scales
  xScale.value = d3.scaleBand()
    .domain(data.value.map(d => d.month))
    .range([0, width.value])
    .padding(0.2)

  yScale.value = d3.scaleLinear()
    .domain([0, maxAmount.value])
    .range([height.value, 0])

  // axes
  if (svg.value && xScale.value && yScale.value) {
    const xAxis = d3.axisBottom(xScale.value)
    const yAxis = d3.axisLeft(yScale.value).tickFormat(d => `$${d}`)

    svg.value.append('g')
      .attr('transform', `translate(0, ${height.value})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')

    svg.value.append('g')
      .call(yAxis)

    // bars
    svg.value.selectAll('rect')
      .data(data.value)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return xScale.value ? (xScale.value(d.month) ?? 0) : 0
      })
      .attr('y', function(d) {
        return yScale.value ? Number(yScale.value(d.amount)) : 0
      })
      .attr('width', function() {
        return xScale.value ? Number(xScale.value.bandwidth()) : 0
      })
      .attr('height', function(d) {
        return yScale.value ? Number(height.value - yScale.value(d.amount)) : 0
      })
      .attr('fill', '#5470c6')
      .on('mouseover', function(event, d) {
        // TODO useTippy for displaying tooltip-table & abstract tooltip-table to its own component
        d3.select(this).attr('fill', '#3a8ee6')

        selectedMonth.value = d

        const rect = this.getBoundingClientRect()
        const containerRect = chartContainer.value!.getBoundingClientRect()

        popoverPosition.x = rect.x + rect.width / 2 - containerRect.x
        popoverPosition.y = rect.y - containerRect.y

        popoverVisible.value = true
      })
      .on('mouseout', function() {
        // Restore original color
        d3.select(this).attr('fill', '#5470c6')
        setTimeout(() => {
          popoverVisible.value = false
        }, 5)
      })

    //  threshold line
    thresholdLine.value = svg.value.append('line')
      .attr('x1', 0)
      .attr('x2', width.value)
      .attr('y1', yScale.value(thresholdValue.value))
      .attr('y2', yScale.value(thresholdValue.value))
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')

    //  axis labels
    svg.value.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-margin.left / 2}, ${height.value / 2}) rotate(-90)`)
      .text('Dollar Amount ($)')

    svg.value.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width.value / 2}, ${height.value + 50})`)
      .text('Month')

    //  title
    svg.value.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width.value / 2}, ${-margin.top / 2})`)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Monthly Revenue')
  }
}