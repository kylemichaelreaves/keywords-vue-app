<template>
  <div :data-testid="props.dataTestId">
    <!-- Show skeleton while loading -->
    <div v-if="isLoading" class="chart-container">
      <el-skeleton
        animated
        :data-testid="`${props.dataTestId}-skeleton`"
        style="height: 400px; width: 100%"
      >
        <template #template>
          <div style="display: flex; justify-content: center; align-items: center; height: 100%">
            <el-skeleton-item variant="circle" style="width: 300px; height: 300px" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- Show actual chart when loaded and has data -->
    <div
      v-else-if="props.data && props.data.length > 0 && pieData.length > 0"
      ref="chartContainer"
      class="chart-container"
      :data-testid="`${props.dataTestId}-chart`"
    >
      <!-- Chart Controls -->
      <div class="chart-controls">
        <el-switch
          v-model="localShowLegend"
          active-text="Show Legend"
          inactive-text="Hide Legend"
          :data-testid="`${props.dataTestId}-legend-toggle`"
        />
      </div>

      <el-space direction="vertical" class="w-full" style="align-items: center">
        <el-text size="large" :data-testid="`${props.dataTestId}-title`">
          {{ title }}
        </el-text>
      </el-space>

      <!-- Chart and Legend Container -->
      <div class="chart-and-legend-container">
        <!-- Chart at the top -->
        <div class="chart-wrapper">
          <svg ref="svgRef" :width="chartDimensions.width" :height="chartDimensions.height"></svg>
        </div>

        <!-- Legend at the bottom -->
        <div
          v-show="localShowLegend"
          class="legend-bottom"
          :data-testid="`${props.dataTestId}-legend`"
        >
          <h4>Legend</h4>
          <div class="legend-items-container">
            <div
              v-for="item in legendItems"
              :key="item.category_id"
              class="legend-item"
              :data-testid="`${props.dataTestId}-legend-item-${item.category_id}`"
            >
              <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
              <span class="legend-text"
                >{{ item.category_name }} ({{
                  formatCurrency(Math.abs(item.total_amount_debit))
                }})</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Show message when no data -->
    <div
      v-else-if="props.data && props.data.length === 0"
      class="no-data-message"
      :data-testid="`${props.dataTestId}-no-data`"
    >
      <el-text type="info">No budget category data available for visualization.</el-text>
    </div>

    <!-- Show fallback when conditions don't match -->
    <div v-else style="background: #ffe6e6; padding: 20px; text-align: center">
      <strong>FALLBACK STATE</strong><br />
      This shouldn't show if everything is working correctly.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ElSkeleton, ElSkeletonItem, ElSpace, ElText, ElSwitch } from 'element-plus'
import * as d3 from 'd3'
import type { BudgetCategorySummary } from '@types'

const props = defineProps<{
  data: BudgetCategorySummary[]
  isLoading?: boolean
  title?: string
  dataTestId?: string
  showLegend?: boolean
}>()

// Template refs
const svgRef = ref<SVGElement | null>(null)
const chartContainer = ref<HTMLElement | null>(null)

// Local state for legend visibility (if not controlled by props)
const localShowLegend = ref(true)

// Chart dimensions
const chartDimensions = ref({
  width: 480,
  height: 400,
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
})

// Create pie chart data (show only parent categories since they already include child totals)
const pieData = computed(() => {
  console.log('PieChart: Computing pieData', {
    propsData: props.data,
    propsDataLength: props.data?.length || 0,
    isLoading: props.isLoading,
  })

  if (!props.data?.length) {
    console.log('PieChart: No data in props, returning empty array')
    return []
  }

  // Let's examine the first few items to understand the data structure
  console.log(
    'PieChart: Sample data items:',
    props.data.slice(0, 3).map((item) => ({
      category_id: item.category_id,
      category_name: item.category_name,
      total_amount_debit: item.total_amount_debit,
      budget_category: item.budget_category,
      parent_id: item.parent_id,
      level: item.level,
      allProps: Object.keys(item),
    })),
  )

  // Since backend already aggregates child totals into parents, just show parent categories
  const parentCategories = props.data.filter(
    (cat) => cat.parent_id === null && Math.abs(cat.total_amount_debit) > 0,
  )

  console.log('PieChart: Parent categories for pie chart', {
    originalLength: props.data.length,
    parentCount: parentCategories.length,
    parentData: parentCategories.map((p) => ({
      name: p.category_name,
      total: p.total_amount_debit,
      level: p.level,
    })),
  })

  return parentCategories
})

// Generate color scheme with parent colors and child gradations
const colorScheme = computed(() => {
  const parentCategories = pieData.value.filter((cat) => cat.parent_id === null)
  const baseColors = d3.schemeCategory10.concat(d3.schemeSet2)

  const colorMap = new Map<string, string>()

  parentCategories.forEach((parent, index) => {
    const baseColor = baseColors[index % baseColors.length] || '#999999'
    colorMap.set(String(parent.category_id), baseColor)

    // Generate shades for children
    const children = pieData.value.filter((cat) => cat.parent_id === parent.category_id)
    children.forEach((child, childIndex) => {
      const colorObj = d3.color(baseColor)
      const shade = colorObj?.darker(0.3 + childIndex * 0.2)
      const shadeColor = shade ? shade.toString() : baseColor
      colorMap.set(String(child.category_id), shadeColor)
    })
  })

  return colorMap
})

// Legend items
const legendItems = computed(() => {
  return pieData.value.map((category) => ({
    ...category,
    color: colorScheme.value.get(String(category.category_id)) || '#999999', // Fixed: Convert to string
  }))
})

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Draw the pie chart
const drawChart = async () => {
  if (!svgRef.value || !pieData.value.length) return

  await nextTick()

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove() // Clear previous chart

  const { width, height, margin } = chartDimensions.value
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const radius = Math.min(chartWidth, chartHeight) / 2

  const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)

  // Create pie layout for parent categories
  const pie = d3
    .pie<BudgetCategorySummary>()
    .value((d) => Math.abs(d.total_amount_debit))
    .sort(null)

  // Create arc generators for different rings
  const innerArc = d3
    .arc<d3.PieArcDatum<BudgetCategorySummary>>()
    .innerRadius(0)
    .outerRadius(radius * 0.6) // Inner ring for parents

  const outerArc = d3
    .arc<d3.PieArcDatum<BudgetCategorySummary>>()
    .innerRadius(radius * 0.65) // Small gap
    .outerRadius(radius - 10) // Outer ring for children

  const hoverArc = d3
    .arc<d3.PieArcDatum<BudgetCategorySummary>>()
    .innerRadius(0)
    .outerRadius(radius * 0.65)

  // Generate pie data for parents
  const pieDataGenerated = pie(pieData.value)

  // Create tooltip
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'pie-chart-tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('z-index', '1000')

  // Container for child slices
  const childrenGroup = g.append('g').attr('class', 'children-slices')

  // Draw parent pie slices (inner ring)
  const parentSlices = g
    .selectAll('.parent-arc')
    .data(pieDataGenerated)
    .enter()
    .append('g')
    .attr('class', 'parent-arc')

  parentSlices
    .append('path')
    .attr('d', innerArc)
    .attr('fill', (d) => colorScheme.value.get(String(d.data.category_id)) || '#999999')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
      // Enlarge the hovered parent slice
      d3.select(this).transition().duration(200).attr('d', hoverArc(d))

      // Show children in outer ring
      showChildrenSlices(d)

      // Show tooltip
      const children = props.data.filter(
        (cat) => cat.parent_id === d.data.category_id && Math.abs(cat.total_amount_debit) > 0,
      )

      let tooltipContent = `<strong>${d.data.category_name}</strong><br/>`
      tooltipContent += `Total: ${formatCurrency(Math.abs(d.data.total_amount_debit))}<br/>`
      tooltipContent += `Percentage: ${((Math.abs(d.data.total_amount_debit) / d3.sum(pieData.value, (d) => Math.abs(d.total_amount_debit))) * 100).toFixed(1)}%`

      if (children.length > 0) {
        tooltipContent += `<br/><small>${children.length} subcategories</small>`
      }

      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip
        .html(tooltipContent)
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px')
    })
    .on('mousemove', function (event) {
      tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY - 28 + 'px')
    })
    .on('mouseout', function (_event, d) {
      // Reset parent slice
      d3.select(this).transition().duration(200).attr('d', innerArc(d))

      // Hide children slices
      hideChildrenSlices()

      // Hide tooltip
      tooltip.transition().duration(500).style('opacity', 0)
    })

  // Add labels for parent slices
  const labelArc = d3
    .arc<d3.PieArcDatum<BudgetCategorySummary>>()
    .innerRadius(radius * 0.3)
    .outerRadius(radius * 0.3)

  parentSlices
    .append('text')
    .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '11px')
    .style('font-weight', 'bold')
    .style('fill', 'white')
    .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)')
    .text((d) => {
      const percentage =
        (Math.abs(d.data.total_amount_debit) /
          d3.sum(pieData.value, (d) => Math.abs(d.total_amount_debit))) *
        100
      return percentage > 8 ? `${percentage.toFixed(0)}%` : ''
    })

  // Function to show children slices in outer ring
  function showChildrenSlices(parentData: d3.PieArcDatum<BudgetCategorySummary>) {
    const children = props.data.filter(
      (cat) =>
        cat.parent_id === parentData.data.category_id && Math.abs(cat.total_amount_debit) > 0,
    )

    if (children.length === 0) return

    // Create pie layout for children within the parent's angle range
    const childPie = d3
      .pie<BudgetCategorySummary>()
      .value((d) => Math.abs(d.total_amount_debit))
      .startAngle(parentData.startAngle)
      .endAngle(parentData.endAngle)
      .sort(null)

    const childrenData = childPie(children)
    const parentBaseColor = colorScheme.value.get(String(parentData.data.category_id)) || '#999999'

    // Draw children slices
    const childSlices = childrenGroup
      .selectAll('.child-arc')
      .data(childrenData)
      .enter()
      .append('g')
      .attr('class', 'child-arc')

    childSlices
      .append('path')
      .attr('d', outerArc)
      .attr('fill', (d, i) => {
        const shade = d3.color(parentBaseColor)?.darker(0.2 + i * 0.3)
        return shade ? shade.toString() : parentBaseColor
      })
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .duration(300)
      .style('opacity', 0.9)

    // Add labels for children (only for larger slices)
    const childLabelArc = d3
      .arc<d3.PieArcDatum<BudgetCategorySummary>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8)

    childSlices
      .append('text')
      .attr('transform', (d) => `translate(${childLabelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('font-weight', 'normal')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .style('opacity', 0)
      .text((d) => {
        const childPercentage =
          (Math.abs(d.data.total_amount_debit) / Math.abs(parentData.data.total_amount_debit)) * 100
        return childPercentage > 15 ? d.data.category_name.substring(0, 8) : ''
      })
      .transition()
      .duration(300)
      .style('opacity', 1)
  }

  // Function to hide children slices
  function hideChildrenSlices() {
    childrenGroup.selectAll('.child-arc').transition().duration(200).style('opacity', 0).remove()
  }
}

// Watch for data changes and redraw
watch(
  () => props.data,
  async (newData, oldData) => {
    console.log('PieChart: Data prop changed', {
      newDataLength: newData?.length || 0,
      oldDataLength: oldData?.length || 0,
      hasNewData: !!newData?.length,
      isLoading: props.isLoading,
    })

    if (!props.isLoading && newData && newData.length > 0) {
      await nextTick()
      drawChart()
    }
  },
  { immediate: true, deep: true },
)

// Also watch for loading state changes
watch(
  () => props.isLoading,
  async (isLoading) => {
    console.log('PieChart: Loading state changed', { isLoading })

    if (!isLoading && props.data && props.data.length > 0) {
      await nextTick()
      drawChart()
    }
  },
  { immediate: true },
)

// Watch for legend visibility changes
watch(
  () => localShowLegend.value,
  () => {
    // No need to redraw chart, just toggle legend visibility
  },
)

onMounted(async () => {
  console.log('PieChart: Component mounted', {
    hasData: !!props.data?.length,
    isLoading: props.isLoading,
  })

  if (!props.isLoading && props.data && props.data.length > 0) {
    await nextTick()
    drawChart()
  }
})
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  white-space: nowrap;
}

.no-data-message {
  text-align: center;
  padding: 40px;
}

.chart-controls {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.chart-and-legend-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.chart-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.legend-bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.legend-items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
</style>
